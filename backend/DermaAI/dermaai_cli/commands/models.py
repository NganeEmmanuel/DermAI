# dermaai_cli/commands/models.py
import typer
from dermaai_cli.core import model_manager

app = typer.Typer()


@app.command("get-models")
def get_models():
    """List locally installed models"""
    models = model_manager.list_models()
    for m in models:
        typer.echo(f"- v{m['version']} ({m['path']})")


@app.command("download-models")
def download_model(version: int):
    typer.echo(f"Downloading model v{version}...")
    model_path, classes_path = model_manager.ensure_model_exists(version)
    typer.echo(f"Model path: {model_path} ({model_path.stat().st_size} bytes)")
    typer.echo(f"Classes path: {classes_path} ({classes_path.stat().st_size} bytes)")
    typer.echo("Done.")



@app.command("model-info")
def model_info(version: int):
    """Show metadata about a model"""
    info = model_manager.get_model_info(version)
    for k, v in info.items():
        typer.echo(f"{k}: {v}")
