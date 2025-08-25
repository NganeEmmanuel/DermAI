```
IAC/
├── main.tf               # Root entry point - loads modules
├── variables.tf          # Global variables (e.g., region, env)
├── outputs.tf            # Global outputs (API URLs, ARNs)
├── providers.tf          # AWS provider config
├── backend.tf            # Terraform state backend (S3 + DynamoDB)
├── modules/              # All modular components
│   ├── api_gateway/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   ├── outputs.tf
│   ├── sqs/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   ├── outputs.tf
│   ├── lambda/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   ├── outputs.tf
│   ├── dynamodb/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   ├── outputs.tf
│   ├── s3/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   ├── outputs.tf
├── envs/                 # Separate environment configs
│   ├── dev.tfvars
│   ├── prod.tfvars
```
