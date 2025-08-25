import argparse
from commands.submit import submit_request
from commands.result import get_result


def main():
    parser = argparse.ArgumentParser(description="DermaAI CLI")

    subparsers = parser.add_subparsers(dest="command", help="Available commands")

    # Submit command
    submit_parser = subparsers.add_parser("submit", help="Submit a new request")
    submit_parser.add_argument("--images", nargs="+", required=True, help="List of image paths (S3 URIs)")
    submit_parser.add_argument("--ui", default="CLI", choices=["CLI", "Mobile"], help="UI type")
    submit_parser.add_argument("--processing", default="Single", choices=["Single", "Batch"], help="Processing type")
    submit_parser.add_argument("--model_version", type=int, default=3, help="Model version")
    submit_parser.add_argument("--output", default="json", help="Output format")

    # Result command
    result_parser = subparsers.add_parser("result", help="Fetch result for a request")
    result_parser.add_argument("request_id", help="The request ID to fetch result for")

    args = parser.parse_args()

    if args.command == "submit":
        response = submit_request(
            images=args.images,
            ui=args.ui,
            processing_type=args.processing,
            model_version=args.model_version,
            output_format=args.output
        )
        print("Response:", response)

    elif args.command == "result":
        response = get_result(args.request_id)
        print("Response:", response)

    else:
        parser.print_help()


if __name__ == "__main__":
    main()
