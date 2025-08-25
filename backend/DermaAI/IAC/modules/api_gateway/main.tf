# API Gateway HTTP API
resource "aws_apigatewayv2_api" "this" {
  name          = var.api_name
  protocol_type = "HTTP"
}

# Stage
resource "aws_apigatewayv2_stage" "this" {
  api_id      = aws_apigatewayv2_api.this.id
  name        = var.stage_name
  auto_deploy = true
}
locals {
  route_keys = [
    "POST /upload-urls",
    "POST /submit",
    "GET /result/{request_id}"
  ]

  route_map = { for k in local.route_keys : k => lookup(var.routes, k) }
}

resource "aws_apigatewayv2_integration" "this" {
  for_each               = local.route_map
  api_id                 = aws_apigatewayv2_api.this.id
  integration_type       = "AWS_PROXY"
  integration_uri        = each.value
  integration_method     = split(" ", each.key)[0]
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "this" {
  for_each  = local.route_map
  api_id    = aws_apigatewayv2_api.this.id
  route_key = each.key
  target    = "integrations/${aws_apigatewayv2_integration.this[each.key].id}"
}

resource "aws_lambda_permission" "apigw" {
  for_each     = local.route_map
  statement_id = "AllowAPIGatewayInvoke-${replace(replace(replace(replace(each.key, " ", "_"), "/", "_"), "{", "_"), "}", "_")}"
  action       = "lambda:InvokeFunction"
  function_name = each.value
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.this.execution_arn}/*/*"
}
