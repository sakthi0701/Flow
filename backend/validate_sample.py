import json
import os
from jsonschema import validate, Draft7Validator


ROOT = os.path.dirname(__file__)


def validate_sample():
    sample_path = os.path.join(ROOT, "sample_data", "sample.json")
    schema_path = os.path.join(ROOT, "schemas", "user_schema.json")

    with open(sample_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    with open(schema_path, "r", encoding="utf-8") as f:
        schema = json.load(f)

    v = Draft7Validator(schema)
    errors = sorted(v.iter_errors(data), key=lambda e: e.path)
    if errors:
        for e in errors:
            print(f"Validation error: {e.message} at {list(e.path)}")
        return False
    else:
        print("Sample data is valid against user_schema.json")
        return True


if __name__ == "__main__":
    validate_sample()
