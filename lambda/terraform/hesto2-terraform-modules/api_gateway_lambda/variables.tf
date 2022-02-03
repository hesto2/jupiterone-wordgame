variable "domain_name" {
  type = string
}

variable "regional_certificate_arn" {
  type = string
}

variable "route53_zone_id" {
  type = string
}

variable "apigateway_stage_name" {
  type    = string
  default = "v1"
}

variable "app_name" {
  type = string
}

variable "filename" {
  type    = string
  default = "deploy.zip"
}

variable "s3_bucket" {
  type    = string
  default = null
}
variable "s3_key" {
  type    = string
  default = null
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
