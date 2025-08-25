module "dynamodb_requests" {
  source      = "./modules/dynamodb"
  table_name  = "dermaai-requests-table"
  environment = "dev"
}

module "s3_model_and_code" {
  source      = "./modules/s3"
  bucket_name = "dermaai-model-and-code-bucket"
  environment = "dev"
}

module "s3_model" {
  source      = "./modules/s3"
  bucket_name = "dermaai-model-bucket"
  environment = "dev"
}

module "s3_request_images" {
  source      = "./modules/s3"
  bucket_name = "dermaai-request-images-bucket"
  environment = "dev"
}

module "classification_queue" {
  source             = "./modules/sqs"
  queue_name         = "dermaai-classification-queue"
  visibility_timeout = 600 # Allow model enough time
  environment        = "dev"
}

module "description_queue" {
  source             = "./modules/sqs"
  queue_name         = "dermaai-description-queue"
  visibility_timeout = 300
  environment        = "dev"
}


# Role for Classification Lambda
module "classification_lambda_role" {
  source     = "./modules/iam_lambda_role"
  role_name  = "dermaai-classification-role"
  policy_json = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect   = "Allow"
        Action   = ["s3:GetObject"]
        Resource = "arn:aws:s3:::dermaai-model-and-code-bucket/*"
      },
      {
        Effect   = "Allow"
        Action   = ["sqs:SendMessage", "sqs:ReceiveMessage", "sqs:DeleteMessage", "sqs:GetQueueAttributes"]
        Resource = module.classification_queue.queue_arn
      },
      {
        Effect   = "Allow"
        Action   = ["dynamodb:PutItem", "dynamodb:UpdateItem"]
        Resource = "arn:aws:dynamodb:${var.aws_region}:${var.aws_account_id}:table/dermaai-requests-table"
      },
      {
        Effect = "Allow"
        Action = ["s3:GetObject"]
        Resource = "arn:aws:s3:::dermaai-model-bucket/*"
      }
    ]
  })
}

# upload images roles
module "upload_lambda_role" {
  source     = "./modules/iam_lambda_role"
  role_name  = "dermaai-upload-role"
  policy_json = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect   = "Allow"
        Action   = ["s3:PutObject"]
        Resource = "arn:aws:s3:::dermaai-request-images-bucket/*"
      }
    ]
  })
}


# Role for Description Lambda
module "description_lambda_role" {
  source     = "./modules/iam_lambda_role"
  role_name  = "dermaai-description-role"
  policy_json = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect   = "Allow"
        Action   = ["sqs:ReceiveMessage", "sqs:DeleteMessage", "sqs:GetQueueAttributes"]
        Resource = module.description_queue.queue_arn
      },
      {
        Effect   = "Allow"
        Action   = ["dynamodb:GetItem", "dynamodb:UpdateItem"]
        Resource = "arn:aws:dynamodb:${var.aws_region}:${var.aws_account_id}:table/dermaai-requests-table"
      },
      {
        Effect   = "Allow"
        Action   = ["secretsmanager:GetSecretValue"]
        Resource = "arn:aws:secretsmanager:${var.aws_region}:${var.aws_account_id}:secret:openai-api-key-*"
      }
    ]
  })
}
# Submit Request Lambda (ZIP)
module "lambda_submit_request" {
  source                = "./modules/lambda_function_zip"
  function_name         = "dermaai-submit-request"
  role_arn              = module.classification_lambda_role.role_arn
  handler               = "main.handler"
  runtime               = "python3.12"
  lambda_package        = "${path.module}/lambda_packages/submit_request.zip"
  timeout               = 60
  memory_size           = 1024
  environment_variables = {
    RESULTS_TABLE            = "dermaai-requests-table"
    CLASSIFICATION_QUEUE_URL = module.classification_queue.queue_url
  }
}

# Classification Lambda (Image)
module "lambda_classification" {
  source        = "./modules/lambda_function_image"
  function_name = "dermaai-classification"
  role_arn      = module.classification_lambda_role.role_arn
  image_uri     = "${var.aws_account_id}.dkr.ecr.eu-north-1.amazonaws.com/classification-lambda:latest"
  timeout       = 60
  memory_size   = 1024
  sqs_arn       = module.classification_queue.queue_arn
  environment_variables = {
    MODEL_BUCKET  = "dermaai-model-bucket"
    RESULTS_TABLE = "dermaai-requests-table"
    OUTPUT_QUEUE  = module.description_queue.queue_url
  }
}

# Description Lambda (Image)
# module "lambda_description" {
#   source        = "./modules/lambda_function_image"
#   function_name = "dermaai-description"
#   role_arn      = module.description_lambda_role.role_arn
#   image_uri     = "${var.aws_account_id}.dkr.ecr.eu-north-1.amazonaws.com/description-lambda:latest"
#   timeout       = 60
#   memory_size   = 1024
#   sqs_arn       = module.description_queue.queue_arn
#   environment_variables = {
#     RESULTS_TABLE      = "dermaai-requests-table"
#     OPENAI_SECRET_NAME = "openai-api-key"
#   }
# }

# Get Result Lambda (ZIP)
module "lambda_get_result" {
  source                = "./modules/lambda_function_zip"
  function_name         = "dermaai-get-result"
  role_arn              = module.description_lambda_role.role_arn
  handler               = "main.handler"
  runtime               = "python3.12"
  lambda_package        = "${path.module}/lambda_packages/get_result.zip"
  timeout               = 60
  memory_size           = 1024
  environment_variables = {
    RESULTS_TABLE = "dermaai-requests-table"
  }
}

# Generate Upload URLs Lambda (ZIP)
module "lambda_generate_upload_urls" {
  source                = "./modules/lambda_function_zip"
  function_name         = "dermaai-generate-upload-urls"
  role_arn              = module.upload_lambda_role.role_arn
  handler               = "main.handler"
  runtime               = "python3.12"
  lambda_package        = "${path.module}/lambda_packages/generate_upload_urls.zip"
  timeout               = 30
  memory_size           = 512
  environment_variables = {
    IMAGE_BUCKET = module.s3_request_images.bucket_name
  }
}

# API Gateway
module "api_gateway" {
  source     = "./modules/api_gateway"
  api_name   = "dermaai-api"
  stage_name = "dev"

  routes = {
    "POST /upload-urls"        = module.lambda_generate_upload_urls.function_arn
    "POST /submit"             = module.lambda_submit_request.function_arn
    "GET /result/{request_id}" = module.lambda_get_result.function_arn
  }
}
