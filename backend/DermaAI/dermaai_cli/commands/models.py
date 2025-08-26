# dermaai_cli/commands/models.py
import typer
from rich.console import Console
from rich.table import Table
from dermaai_cli.core import model_manager

app = typer.Typer()
console = Console()


@app.command("get-models")
def get_models():
    """
    List locally installed models
    (example command: dermai get-models)
    """
    models = model_manager.list_models()
    if not models:
        console.print("[yellow]No models installed yet.[/yellow]")
        return

    table = Table(title="Installed Models")
    table.add_column("Version", style="cyan", justify="center")
    table.add_column("Path", style="magenta")
    table.add_column("Classes", style="green", justify="center")
    table.add_column("Accuracy", style="bold blue", justify="center")

    for m in models:
        table.add_row(
            f"v{m['version']}",
            m["path"],
            str(m["metadata"].get("num_classes", "?")),
            str(m["metadata"].get("accuracy", "?")),
        )

    console.print(table)


@app.command("download-model")
def download_model(version: int):
    """
    Download a model from DermaAI
    (example command: dermai download-model <version>)
    """
    console.print(f"[cyan]Downloading model v{version}...[/cyan]")
    model_path, classes_path = model_manager.ensure_model_exists(version)
    console.print(f"[green]✔ Model path:[/green] {model_path}")
    console.print(f"[green]✔ Classes path:[/green] {classes_path}")
    console.print("[bold green]Done.[/bold green]")


@app.command("model-info")
def model_info(version: int):
    """
    Show metadata about a model
    (example command: dermai model-info <version>)
    """
    try:
        info = model_manager.get_model_info(version)
    except ValueError as e:
        console.print(f"[red]{str(e)}[/red]")
        raise typer.Exit(code=1)

    # Metadata table
    table = Table(title=f"Model v{version} Info")
    table.add_column("Key", style="cyan", no_wrap=True)
    table.add_column("Value", style="magenta")

    # Path
    table.add_row("Path", info["path"])

    # Metadata
    for k, v in info["metadata"].items():
        table.add_row(k, str(v))

    console.print(table)

    # Classes table (separate for clarity)
    if info.get("classes"):
        classes_table = Table(title="Classes")
        classes_table.add_column("Index", style="cyan", justify="right")
        classes_table.add_column("Class Name", style="green")

        for idx, cls in enumerate(info["classes"], start=1):
            classes_table.add_row(str(idx), cls)

        console.print(classes_table)
    else:
        console.print("[yellow]No classes found for this model.[/yellow]")
