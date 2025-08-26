# dermaai_cli/core/output.py
import pandas as pd
from reportlab.platypus import SimpleDocTemplate, Paragraph, Table, TableStyle, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib import colors


def save_results(results, fmt, path):
    df = pd.DataFrame(results)
    summary = df["prediction"].value_counts().to_dict()
    summary_str = "\n".join([f"{v} = {k}" for k, v in summary.items()])

    if fmt == "md":
        with open(path, "w", encoding="utf-8") as f:
            f.write(df.to_markdown(index=False))
            f.write("\n\nSummary:\n" + summary_str)

    elif fmt == "csv":
        df.to_csv(path, index=False)

    elif fmt == "json":
        df.to_json(path, orient="records", indent=2)

    elif fmt == "pdf":
        doc = SimpleDocTemplate(str(path))
        styles = getSampleStyleSheet()
        elements = []

        # Title
        elements.append(Paragraph("DermaAI Results", styles["Title"]))
        elements.append(Spacer(1, 12))

        # Data table
        data = [list(df.columns)] + df.values.tolist()
        table = Table(data, repeatRows=1)
        table.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#4a90e2")),
            ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
            ("ALIGN", (0, 0), (-1, -1), "CENTER"),
            ("GRID", (0, 0), (-1, -1), 0.25, colors.grey),
            ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
            ("FONTSIZE", (0, 0), (-1, -1), 9),
        ]))
        elements.append(table)
        elements.append(Spacer(1, 24))

        # Summary section
        elements.append(Paragraph("Summary", styles["Heading2"]))
        for k, v in summary.items():
            elements.append(Paragraph(f"{v} = {k}", styles["Normal"]))

        # Build PDF
        doc.build(elements)

    else:
        raise ValueError(f"Unknown format: {fmt}")
