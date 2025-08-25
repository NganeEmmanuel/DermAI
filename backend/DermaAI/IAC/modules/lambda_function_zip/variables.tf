variable "function_name" { type = string }
variable "role_arn" { type = string }
variable "handler" { type = string }
variable "runtime" { type = string }
variable "lambda_package" { type = string }
variable "timeout" { type = number }
variable "memory_size" { type = number }
variable "environment_variables" { type = map(string) }
variable "sqs_arn" {
  type = string
  default = ""
}

variable "package_type" {
  type    = string
  default = null
}

variable "image_uri" {
  type    = string
  default = null
}
