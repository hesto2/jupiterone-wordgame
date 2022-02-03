resource "aws_s3_bucket" "terraform_state" {
  bucket = var.s3_bucket_name
  acl    = "private"
  tags   = { Name = "terraform-backend" }
}
resource "aws_dynamodb_table" "terraform_state_lock" {
  name           = var.dynamodb_table_name
  read_capacity  = 5
  write_capacity = 5
  hash_key       = "LockID"
  tags           = { Name = "terraform-backend" }
  attribute {
    name = "LockID"
    type = "S"
  }
}