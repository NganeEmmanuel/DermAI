variable "role_name" {
  type        = string
  description = "IAM Role name"
}

variable "policy_json" {
  type        = string
  description = "Inline policy JSON for the role"
}
