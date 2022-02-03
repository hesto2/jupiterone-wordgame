module "api_gateway_lambda" {
  source = "../node_modules/hesto2-terraform-modules/api_gateway_lambda"
  domain_name = "jupiteronewordle.hesto2.com"
  app_name = "wordle"
  regional_certificate_arn = "${data.terraform_remote_state.infrastructure_state.outputs.hesto2_regional_certificate_arn}"
  route53_zone_id = "${data.terraform_remote_state.infrastructure_state.outputs.hesto2_zone_id}"
  filename = "deploy.zip"
  lambda_environment_variables = {
    NODE_ENV = "production"
  }
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