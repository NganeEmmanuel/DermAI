# dermaai_cli/core/output.py
import pandas as pd
import pypandoc


def save_results(results, fmt, path):
    df = pd.DataFrame(results)
    summary = df["prediction"].value_counts().to_dict()
    summary_str = "\nSummary:\n" + "\n".join([f"{v} = {k}" for k, v in summary.items()])

    if fmt == "md":
        with open(path, "w") as f:
            f.write(df.to_markdown(index=False))
            f.write("\n\n" + summary_str)
    elif fmt == "csv":
        df.to_csv(path, index=False)
    elif fmt == "json":
        df.to_json(path, orient="records", indent=2)
    elif fmt == "pdf":
        md_content = df.to_markdown(index=False) + "\n\n" + summary_str
        pypandoc.convert_text(md_content, "pdf", format="md", outputfile=str(path), extra_args=["--standalone"])
    else:
        raise ValueError(f"Unknown format: {fmt}")
