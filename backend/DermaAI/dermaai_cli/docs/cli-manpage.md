
````
DermaAI CLI - Skin Lesion Detection Tool
----------------------------------------

Usage:
  dermai [command] [options]

Modes:
  -mode <offline|online>    Select inference mode

Core Commands:
  predict                   Run prediction on images
  get-models                List locally installed models
  download-model            Download a new model version
  model-info                Show metadata about a model
  interactive               Start interactive REPL mode
  help                      Show help message

Options (common across commands):
  --model-version <int>     Specify which local model to use (default: latest)
  --images <path(s)>        Path(s) to one or more image files
  --images-source-file <f>  File containing list/JSON of image paths
  --output-format <fmt>     Output format: pdf | csv | json | md (default: md)
  --output-path <path>      Save output file location
  -h, --help                Show command help

Examples:
  dermai predict -mode offline --model-version 3 --images img1.jpg img2.jpg
  dermai predict -mode offline --images-source-file images.json --output-format pdf
  dermai get-models
  dermai model-info --version 3
  dermai download-model --version 4
  dermai interactive
```