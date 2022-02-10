module "api_gateway_lambda" {
  source = "./hesto2-terraform-modules/api_gateway_lambda"
  domain_name = "jupiteronewordle.hesto2.com"
  app_name = "wordle"
  regional_certificate_arn = "${data.terraform_remote_state.infrastructure_state.outputs.hesto2_regional_certificate_arn}"
  route53_zone_id = "${data.terraform_remote_state.infrastructure_state.outputs.hesto2_zone_id}"
  filename = "deploy.zip"
  lambda_environment_variables = {
    NODE_ENV = "production"
    DATA_BUCKET_NAME = "jupiterone-wordle-data"
    ADMIN_PASSWORD = "${data.aws_secretsmanager_secret_version.admin_key.secret_string}"
  }
}

resource "aws_iam_role_policy_attachment" "attachment" {
  role       = "${module.api_gateway_lambda.role_name}"
  policy_arn = "${aws_iam_policy.iam_policy.arn}"
}
resource "aws_iam_policy" "iam_policy" {
  path = "/"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
        "Effect": "Allow",
        "Action": [
            "s3:*"
        ],
        "Resource": "${aws_s3_bucket.wordle_bucket.arn}/*"
    }
  ]
}
EOF
}

data "terraform_remote_state" "infrastructure_state" {
  backend = "s3"
  config = {
    bucket = "hesto2-terraform-state"
    key = "terraform"
    region="us-west-2"
    dynamodb_table = "terraform-lock"
  }
}
data "aws_secretsmanager_secret_version" "admin_key" {
  secret_id = "jupiterone_wordle_admin_key"
}