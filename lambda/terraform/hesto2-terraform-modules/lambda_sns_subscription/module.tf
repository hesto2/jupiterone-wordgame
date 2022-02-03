variable "lambda_function_name" {
  type = "string"
}
variable "lambda_arn" {
  type = "string"
}
variable "topic_arn" {
  type = "string"
}
variable "receiver_id" {
}

resource "aws_lambda_permission" "with_sns" {
  statement_id  = "AllowExecutionFromSNS"
  action        = "lambda:InvokeFunction"
  function_name = var.lambda_function_name
  principal     = "sns.amazonaws.com"
  source_arn    = var.topic_arn
}

resource "aws_sns_topic_subscription" "lambda" {
  topic_arn     = var.topic_arn
  protocol      = "lambda"
  endpoint      = var.lambda_arn
  filter_policy = jsonencode(map("receiver", list(var.receiver_id)))
}