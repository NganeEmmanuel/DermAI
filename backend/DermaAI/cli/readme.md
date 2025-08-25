```
dermaAI/
├── cli/
│   ├── derma_cli.py        # Main entry CLI script
│   ├── commands/
│   │   ├── __init__.py
│   │   ├── submit.py       # CLI logic to submit request
│   │   ├── result.py       # CLI logic to fetch result
│   │   ├── invoke.py       # Common helper to invoke Lambda
│   ├── utils/
│   │   ├── config.py       # Holds constants (Lambda names, region)
│   │   ├── helpers.py      # Helper functions (pretty print, etc.)

```