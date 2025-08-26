# dermaai_cli/commands/predict.py
import json
import typer
import socket
from pathlib import Path
from dermaai_cli.core import inference, output, model_manager

app = typer.Typer()


def _internet_available(host="8.8.8.8", port=53, timeout=3):
    """Quick check for internet connectivity (default: Google DNS)."""
    try:
        socket.setdefaulttimeout(timeout)
        socket.socket(socket.AF_INET, socket.SOCK_STREAM).connect((host, port))
        return True
    except Exception:
        return False


@app.command()
def run(
    mode: str = typer.Option("offline", help="Inference mode: offline or online"),
    model_version: int = typer.Option(..., help="Model version to use"),
    images: list[Path] = typer.Option(None, help="Image file paths"),
    images_source_file: Path = typer.Option(None, help="File with image paths/JSON"),
    output_format: str = typer.Option(None, help="Output format: pdf|csv|json|md"),
    output_path: Path = typer.Option(None, help="Directory where to save results"),
    output_filename: str = typer.Option(None, help="Output file name (without extension)"),
):
    """
    Run predictions on images with flexible output handling.

    Examples:
      --image-source-file path to the json file
       {
          "images": [
            "image_path/image1.jpg",
            "image_path/image2.jpg",,
            "image_path/image3.jpg",,
            "image_path/image4.jpg",
          ]
        }

      --output-format json → results.json in current dir
      --output-filename report → report.md in current dir
      --output-path ./exports → results.md in ./exports
      --output-path ./exports --output-filename report --output-format csv
         → ./exports/report.csv
    """

    typer.echo(f"Running in {mode} mode with model v{model_version}")

    # --- Default fallbacks ---
    if output_format is None:
        output_format = "md"
    if output_filename is None:
        output_filename = "results"
    if output_path is None:
        output_path = Path(".")

    # --- Validation ---
    valid_formats = {"pdf", "csv", "json", "md"}
    if output_format not in valid_formats:
        typer.secho(
            f"❌ Unsupported output format: '{output_format}'. "
            f"Choose one of: {', '.join(valid_formats)}",
            fg=typer.colors.RED,
        )
        raise typer.Exit(code=1)

    # Check if output_path looks like a file
    if output_path.suffix:  # e.g., user passed "results.json"
        typer.secho(
            f"❌ '{output_path}' looks like a file, but --output-path should be a directory.\n"
            "   👉 Use --output-filename and --output-format instead.\n"
            "   Example: --output-filename results --output-format json",
            fg=typer.colors.RED,
        )
        raise typer.Exit(code=1)

    # Create directory safely
    try:
        output_path.mkdir(parents=True, exist_ok=True)
    except PermissionError:
        typer.secho(
            f"❌ Cannot create or write to directory: '{output_path}'. "
            "Check your permissions or choose a different path.",
            fg=typer.colors.RED,
        )
        raise typer.Exit(code=1)

    # Validate filename
    if not output_filename.strip():
        typer.secho(
            "❌ --output-filename cannot be empty. Example: --output-filename report",
            fg=typer.colors.RED,
        )
        raise typer.Exit(code=1)

    # Collect images
    image_paths = []
    if images:
        image_paths.extend(images)
    if images_source_file:
        try:
            # Try parsing as JSON
            with open(images_source_file, "r") as f:
                data = json.load(f)

            if isinstance(data, dict) and "images" in data:
                image_paths.extend([Path(p) for p in data["images"]])
            elif isinstance(data, list):
                image_paths.extend([Path(p) for p in data])
            else:
                typer.secho(
                    f"❌ Invalid JSON format in {images_source_file}. "
                    "Expected {'images': [...]} or a list of paths.",
                    fg=typer.colors.RED,
                )
                raise typer.Exit(code=1)

        except json.JSONDecodeError:
            # Not JSON → fallback to plain text file
            with open(images_source_file, "r") as f:
                lines = f.readlines()
            image_paths.extend([Path(l.strip()) for l in lines if l.strip()])

    if not image_paths:
        typer.secho(
            "❌ No images provided.\n"
            "   👉 Use --images img1.jpg img2.jpg OR --images-source-file file.txt",
            fg=typer.colors.RED,
        )
        raise typer.Exit(code=1)

    # Final output file
    final_output = output_path / f"{output_filename}.{output_format}"

    # Handle online/offline fallback
    if mode.lower() == "online" and not _internet_available():
        typer.secho(
            "⚠️ No internet connection detected. Falling back to OFFLINE mode.",
            fg=typer.colors.YELLOW,
        )
        mode = "offline"

    # Load model + labels
    model_path, labels_path = model_manager.ensure_model_exists(model_version)
    model_bundle = inference.load_model(model_path, labels_path)

    # Run inference
    results = inference.run_inference(model_bundle, image_paths, mode)

    # Save results
    output.save_results(results, output_format, final_output)
    typer.echo(f"✅ Results saved to {final_output}")
