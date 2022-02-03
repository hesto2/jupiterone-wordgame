output "invoke_arn" {
  value = module.lambda.invoke_arn
}

output "function_name" {
  value = module.lambda.function_name
}

output "role_arn" {
  value = module.lambda.role_arn
}
output "role_id" {
  value = module.lambda.role_id
}
output "role_name" {
  value = module.lambda.role_name
}

output "arn" {
  value = module.lambda.arn
}

output "lambda" {
  value = module.lambda
}

output "rest_api" {
  value = aws_api_gateway_rest_api.main
}