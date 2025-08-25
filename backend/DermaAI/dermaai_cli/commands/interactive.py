# dermaai_cli/commands/interactive.py
import typer
from dermaai_cli.core import inference, model_manager, output
from pathlib import Path

app = typer.Typer()


@app.command()
def start():
    """Start interactive REPL mode"""
    print("Welcome to DermaAI Interactive Mode")
    print("Type 'help' for commands, 'exit' to quit")

    current_model = None

    while True:
        cmd = input("dermai> ").strip()
        if cmd in ("exit", "quit"):
            break
        elif cmd == "help":
            print("Commands: predict <image>, models, model-info <v>, switch-model <v>")
        elif cmd.startswith("predict "):
            image = cmd.split(" ", 1)[1]
            if not current_model:
                print("No model loaded. Load one with 'switch-model <version>'")
                continue
            results = inference.run_inference(current_model, [Path(image)])
            for r in results:
                print(f"{r['image']} -> {r['prediction']} ({r['confidence']*100:.1f}%)")
        elif cmd == "models":
            models = model_manager.list_models()
            for m in models:
                print(f"v{m['version']} - {m['path']}")
        elif cmd.startswith("switch-model "):
            version = int(cmd.split(" ", 1)[1])
            model_path, labels_path = model_manager.ensure_model_exists(version)
            current_model = inference.load_model(model_path, labels_path)
            print(f"Switched to model v{version}")
        elif cmd.startswith("model-info "):
            version = int(cmd.split(" ", 1)[1])
            info = model_manager.get_model_info(version)
            print(info)
        else:
            print("Unknown command. Type 'help'.")
