variable "queue_name" {
  description = "Name of the SQS queue"
  type        = string
}

variable "visibility_timeout" {
  description = "Time (seconds) a message is hidden after being picked up"
  type        = number
  default     = 300 # 5 minutes
}

variable "retention_seconds" {
  description = "How long to retain unprocessed messages"
  type        = number
  default     = 345600 # 4 days
}

variable "fifo_queue" {
  description = "Whether this queue is FIFO"
  type        = bool
  default     = false
}

variable "environment" {
  description = "Deployment environment"
  type        = string
  default     = "dev"
}
