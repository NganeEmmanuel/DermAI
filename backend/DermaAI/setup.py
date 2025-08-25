# setup.py
from setuptools import setup, find_packages

setup(
    name="dermaai",
    version="1.0.0",
    description="DermaAI CLI - Skin Lesion Detection Tool",
    author="Your Name",
    packages=find_packages(),
    include_package_data=True,
    install_requires=[
        "pillow~=11.3.0",
        "numpy~=2.3.2",
        "pandas~=2.3.1",
        "torch~=2.7.1",
        "torchvision~=0.22.1",
        "typer[all]~=0.16.1",
        "pypandoc~=1.15"
    ],

    entry_points={
        "console_scripts": [
            "dermai = dermaai_cli.cli:main",
        ],
    },
    python_requires=">=3.9",
)
