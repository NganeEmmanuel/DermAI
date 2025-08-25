# dermaai_cli/cli.py
import typer
from dermaai_cli.commands import predict, models, interactive

app = typer.Typer(help="DermaAI CLI - Skin Lesion Detection Tool")
app.add_typer(predict.app, name="predict", help="Run predictions on images")
app.add_typer(models.app, name="models", help="Manage models (list, info, download)")
app.add_typer(interactive.app, name="interactive", help="Start interactive REPL mode")


def main():
    app()


if __name__ == "__main__":
    main()
