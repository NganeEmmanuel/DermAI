```
dermaai/
│
├── dermaai_cli/                  # CLI implementation (self-contained)
│   ├── __init__.py
│   ├── cli.py                     # Main entry (Typer app or Click app)
│   ├── commands/                  # Subcommand implementations
│   │   ├── __init__.py
│   │   ├── predict.py             # predict command logic
│   │   ├── models.py              # get-models, download-model, model-info
│   │   ├── interactive.py         # REPL interactive mode
│   │   └── utils.py               # shared utilities
│   │
│   ├── core/                      # Core model + inference logic
│   │   ├── __init__.py
│   │   ├── inference.py           # model loading + prediction
│   │   ├── model_manager.py       # handle multiple versions, metadata
│   │   └── output.py              # formatting + exporting (md/pdf/csv/json)
│   │
│   ├── data/                      # (Optional) default resources/config
│   │   ├── model_index.json       # local metadata of installed models
│   │   └── examples/              # sample images for testing
│   │
│   └── tests/                     # Unit tests
│       ├── __init__.py
│       ├── test_predict.py
│       ├── test_models.py
│       └── test_output.py
│
├── setup.py                       # Package setup (pip install dermai)
├── requirements.txt
├── README.md
└── pyproject.toml                 # (if using modern build system)

```