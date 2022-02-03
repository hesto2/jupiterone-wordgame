resource "aws_cloudwatch_event_rule" "timed_rule" {
  description         = "Fires every thirty minutes during business hours"
  schedule_expression = var.schedule_expression
  is_enabled = var.is_enabled
}

resource "aws_cloudwatch_event_target" "check_timed_rule" {
  rule      = aws_cloudwatch_event_rule.timed_rule.name
  target_id = "optimal_blue_cacher"
  arn       = module.lambda.arn
}

resource "aws_lambda_permission" "allow_cloudwatch_to_call_lambda" {
  statement_id  = "AllowExecutionFromCloudWatch"
  action        = "lambda:InvokeFunction"
  function_name = module.lambda.function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.timed_rule.arn
}

