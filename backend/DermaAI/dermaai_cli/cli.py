# dermaai_cli/cli.py
import typer
from dermaai_cli.commands import predict, models, interactive

app = typer.Typer(help="DermaAI CLI - Skin Lesion Detection Tool v1")
app.add_typer(predict.app, name="predict", help="Run predictions on images")
app.add_typer(models.app, help="Manage models (get-models, model-info, download-model)")
app.add_typer(interactive.app, help="Start interactive REPL mode")


def main():
    app()


if __name__ == "__main__":
    main()
