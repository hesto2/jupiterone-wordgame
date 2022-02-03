module "lambda" {
  source                       = "../lambda_app"
  app_name                     = var.app_name
  filename                     = var.filename
  s3_bucket                    = var.s3_bucket
  s3_key                       = var.s3_key
  lambda_environment_variables = var.lambda_environment_variables
  log_retention_days           = var.log_retention_days
  handler                      = var.handler
}

resource "aws_lambda_permission" "apigw" {
  action        = "lambda:InvokeFunction"
  function_name = module.lambda.function_name
  principal     = "apigateway.amazonaws.com"

  # The "/*/*" portion grants access from any method on any resource
  # within the API Gateway REST API.
  source_arn = "${aws_api_gateway_rest_api.main.execution_arn}/*/*/*"
}
