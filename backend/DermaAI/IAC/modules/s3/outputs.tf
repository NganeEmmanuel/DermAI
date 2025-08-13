output "bucket_name" {
  value = aws_s3_bucket.model_and_code.bucket
}

output "bucket_arn" {
  value = aws_s3_bucket.model_and_code.arn
}
