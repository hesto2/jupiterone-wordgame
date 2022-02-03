resource "aws_route53_record" "site" {
  zone_id = var.route53_zone_id
  name    = var.site_domain_name
  type    = "A"
  alias {
    name                   = aws_s3_bucket.site.website_domain
    zone_id                = aws_s3_bucket.site.hosted_zone_id
    evaluate_target_health = false
  }
}