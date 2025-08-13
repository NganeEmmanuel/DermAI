resource "aws_sqs_queue" "this" {
  name                       = var.queue_name
  visibility_timeout_seconds = var.visibility_timeout
  message_retention_seconds  = var.retention_seconds
  fifo_queue                 = var.fifo_queue
  content_based_deduplication = var.fifo_queue

  tags = {
    Name        = var.queue_name
    Environment = var.environment
  }
}
