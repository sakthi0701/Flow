"""List available Gemini models using the Google Generative AI SDK."""
from llm_client import LLMClient

def main():
    client = LLMClient()
    models = client.list_models()
    print("Available Gemini models:")
    for m in models:
        print(f"- {getattr(m, 'name', m)}")

if __name__ == "__main__":
    main()
