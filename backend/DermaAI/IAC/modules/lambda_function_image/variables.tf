variable "function_name" {
  type = string
}

variable "role_arn" {
  type = string
}

variable "image_uri" {
  type = string
}

variable "timeout" {
  type = number
  default = 60
}

variable "memory_size" {
  type = number
  default = 1024
}

variable "environment_variables" {
  type = map(string)
  default = {}
}

variable "sqs_arn" {
  type = string
  default = ""
}
