terraform {
  backend "s3" {
    bucket         = "dermaai-tf-state-lock-bucket"
    key            = "iac/terraform.tfstate"
    region         = "eu-north-1"
    dynamodb_table = "dermaai-tf-lock-table"
    encrypt        = true
  }
}
