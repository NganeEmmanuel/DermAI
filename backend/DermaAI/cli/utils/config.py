import os

# AWS region (could also come from environment)
AWS_REGION = os.environ.get("AWS_REGION", "eu-north-1")

# Lambda function names (from Terraform)
LAMBDA_SUBMIT = "dermaai-classification"  # actually submit_request will go here later via API GW
LAMBDA_GET_RESULT = "dermaai-description" # placeholder until we create get_result Lambda

# In the future we’ll add API Gateway URLs here
