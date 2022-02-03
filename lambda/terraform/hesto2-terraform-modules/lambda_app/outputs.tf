output "invoke_arn" {
  value = aws_lambda_function.lambda.invoke_arn
}

output "function_name" {
  value = aws_lambda_function.lambda.function_name
}

output "role_arn" {
  value = aws_iam_role.lambda_exec.arn
}
output "role_id" {
  value = aws_iam_role.lambda_exec.id
}
output "role_name" {
  value = aws_iam_role.lambda_exec.name
}

output "arn" {
  value = aws_lambda_function.lambda.arn
}

output "lambda" {
  value = aws_lambda_function.lambda
}