# dermaai_cli/commands/predict.py
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
    output_format: str = typer.Option("md", help="Output format: pdf|csv|json|md"),
    output_path: Path = typer.Option("results.md", help="Where to save results"),
):
    """Run prediction on images"""
    typer.echo(f"Running in {mode} mode with model v{model_version}")

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

    # Collect images
    image_paths = []
    if images:
        image_paths.extend(images)
    if images_source_file:
        with open(images_source_file, "r") as f:
            lines = f.readlines()
        image_paths.extend([Path(l.strip()) for l in lines if l.strip()])

    # Run inference
    results = inference.run_inference(model_bundle, image_paths, mode)

    # Save results
    output.save_results(results, output_format, output_path)
    typer.echo(f"✅ Results saved to {output_path}")
