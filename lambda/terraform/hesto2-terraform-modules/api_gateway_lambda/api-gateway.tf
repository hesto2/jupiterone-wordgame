resource "aws_api_gateway_rest_api" "main" {
  name        = "${var.app_name}"
}

resource "aws_api_gateway_resource" "proxy" {
  rest_api_id = "${aws_api_gateway_rest_api.main.id}"
  parent_id = "${aws_api_gateway_rest_api.main.root_resource_id}"
  path_part = "{proxy+}"
}

resource "aws_api_gateway_method" "proxy" {
  rest_api_id = "${aws_api_gateway_rest_api.main.id}"
  resource_id = "${aws_api_gateway_resource.proxy.id}"
  http_method = "ANY"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "lambda" {
  rest_api_id = "${aws_api_gateway_rest_api.main.id}"
  resource_id = "${aws_api_gateway_method.proxy.resource_id}"
  http_method = "${aws_api_gateway_method.proxy.http_method}"
  integration_http_method  = "POST"
  type = "AWS_PROXY"
  uri = "${module.lambda.invoke_arn}"
}

resource "aws_api_gateway_method" "proxy_root" {
  rest_api_id = "${aws_api_gateway_rest_api.main.id}"
  resource_id = "${aws_api_gateway_rest_api.main.root_resource_id}"
  http_method = "ANY"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "lambda_root" {
  rest_api_id = "${aws_api_gateway_rest_api.main.id}"
  resource_id = "${aws_api_gateway_method.proxy_root.resource_id}"
  http_method = "${aws_api_gateway_method.proxy_root.http_method}"
  integration_http_method  = "POST"
  type = "AWS_PROXY"
  uri = "${module.lambda.invoke_arn}"
}

resource "aws_api_gateway_deployment" "main" {
  depends_on = [
    aws_api_gateway_integration.lambda,
    aws_api_gateway_integration.lambda_root
  ]
  rest_api_id = "${aws_api_gateway_rest_api.main.id}"
  stage_name = "${var.apigateway_stage_name}"
}

output "base_url" {
  value = "${aws_api_gateway_deployment.main.invoke_url}"
}



resource "aws_api_gateway_account" "account" {
  cloudwatch_role_arn = "${aws_iam_role.cloudwatch.arn}"
}

# Setup logging
# Setup logging
resource "aws_iam_role" "cloudwatch" {
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "",
      "Effect": "Allow",
      "Principal": {
        "Service": "apigateway.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy" "cloudwatch" {
  role = aws_iam_role.cloudwatch.id
  policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "logs:CreateLogGroup",
                "logs:CreateLogStream",
                "logs:DescribeLogGroups",
                "logs:DescribeLogStreams",
                "logs:PutLogEvents",
                "logs:GetLogEvents",
                "logs:FilterLogEvents"
            ],
            "Resource": "*"
        }
    ]
}
EOF
}

resource "aws_api_gateway_method_settings" "general_settings" {
  depends_on = [
    aws_api_gateway_deployment.main,
    aws_api_gateway_account.account
  ]
  rest_api_id = "${aws_api_gateway_rest_api.main.id}"
  stage_name  = "${aws_api_gateway_deployment.main.stage_name}"
  method_path = "*/*"
  settings {
    # Enable CloudWatch logging and metrics
    metrics_enabled        = true
    data_trace_enabled     = true
    logging_level          = "INFO"
    # Limit the rate of calls to prevent abuse and unwanted charges
    throttling_rate_limit  = 100
    throttling_burst_limit = 50
  }
}

resource "aws_api_gateway_domain_name" "domain" {
  depends_on = [aws_api_gateway_deployment.main]
  domain_name              = "${var.domain_name}"
  regional_certificate_arn = "${var.regional_certificate_arn}"

  endpoint_configuration {
    types = ["REGIONAL"]
  }
}

resource "aws_route53_record" "domain_record" {
  name    = "${aws_api_gateway_domain_name.domain.domain_name}"
  type    = "A"
  zone_id = "${var.route53_zone_id}"

  alias {
    evaluate_target_health = true
    name                   = "${aws_api_gateway_domain_name.domain.regional_domain_name}"
    zone_id                = "${aws_api_gateway_domain_name.domain.regional_zone_id}"
  }
}

resource "aws_api_gateway_base_path_mapping" "gateway_mapping" {
  api_id      = "${aws_api_gateway_rest_api.main.id}"
  stage_name  = "${aws_api_gateway_deployment.main.stage_name}"
  domain_name = "${aws_api_gateway_domain_name.domain.domain_name}"
}