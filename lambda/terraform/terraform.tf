terraform {
  backend "s3" {
    bucket = "hesto2-terraform-state"
    key = "wordle-backend"
    region="us-west-2"
    dynamodb_table = "terraform-lock"
  }
}

provider "aws" {
  region     = "us-west-2"
}