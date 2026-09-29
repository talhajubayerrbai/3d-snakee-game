variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "service_name" {
  description = "Service name used to name resources"
  type        = string
  default     = "snake-game"
}

variable "environment" {
  description = "Deployment environment"
  type        = string
  default     = "dev"
}
