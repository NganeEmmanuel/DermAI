resource "aws_lambda_function" "this" {
  function_name    = var.function_name
  role             = var.role_arn
  handler          = var.handler
  runtime          = var.runtime
  filename         = var.lambda_package
  source_code_hash = filebase64sha256(var.lambda_package)
  timeout          = var.timeout
  memory_size      = var.memory_size
  environment {
    variables = var.environment_variables
  }
}

# Create SQS event trigger if provided
resource "aws_lambda_event_source_mapping" "sqs_trigger" {
  count            = var.sqs_arn != "" ? 1 : 0
  event_source_arn = var.sqs_arn
  function_name    = aws_lambda_function.this.arn
  batch_size       = 1
  enabled          = true
}
