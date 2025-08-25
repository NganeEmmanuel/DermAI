variable "api_name" {
  type        = string
  description = "Name of the API Gateway HTTP API"
}

variable "routes" {
  type        = map(string)
  description = "Map of route => Lambda ARN"
}

variable "stage_name" {
  type        = string
  default     = "dev"
}