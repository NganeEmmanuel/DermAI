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


