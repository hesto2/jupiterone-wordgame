variable "schedule_expression" {
  type = string
}

variable "app_name" {
  type = string
}

variable "filename" {
  type    = string
  default = "deploy.zip"
}

variable "lambda_environment_variables" {
  type    = map
  default = {}
}

variable "log_retention_days" {
  type    = number
  default = 7
}

variable "handler" {
  type    = string
  default = "index.handler"
}

variable "is_enabled" {
  type = bool
  default = true
}

variable "s3_bucket" {
  type    = string
  default = null
}
variable "s3_key" {
  type    = string
  default = null
}



