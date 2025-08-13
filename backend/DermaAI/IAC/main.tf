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
        Resource = "arn:aws:s3:::dermaai-model-bucket/*"
      },
      {
        Effect   = "Allow"
        Action   = ["sqs:SendMessage", "sqs:ReceiveMessage", "sqs:DeleteMessage", "sqs:GetQueueAttributes"]
        Resource = module.classification_queue.queue_arn
      },
      {
        Effect   = "Allow"
        Action   = ["dynamodb:PutItem", "dynamodb:UpdateItem"]
        Resource = "arn:aws:dynamodb:${var.aws_region}:${var.aws_account_id}:table/dermaai-results"
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
        Resource = "arn:aws:dynamodb:${var.aws_region}:${var.aws_account_id}:table/dermaai-results"
      },
      {
        Effect   = "Allow"
        Action   = ["secretsmanager:GetSecretValue"]
        Resource = "arn:aws:secretsmanager:${var.aws_region}:${var.aws_account_id}:secret:openai-api-key-*"
      }
    ]
  })
}


