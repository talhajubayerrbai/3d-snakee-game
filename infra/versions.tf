terraform {
  required_version = ">= 1.10.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.5"
    }
  }

  backend "s3" {
    # bucket, key, region passed via -backend-config at init time
    use_lockfile = true
  }
}

provider "aws" {
  region = var.aws_region
}
