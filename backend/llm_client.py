"""LLMClient wrapper using Google Generative AI SDK with safe fallbacks.

This is a thin wrapper so we can swap implementations later (REST, LiteLLM).
The client attempts to use the Google SDK if available, falling back to a mock
for development/testing.
"""
import os
from typing import Dict, Any, Optional
from dotenv import load_dotenv


class LLMClient:
    def __init__(self, api_key_env_var: str = "GEMINI_API_KEY", model_name: str = "models/gemini-2.5-flash", temperature: float = 0.7, max_tokens: int = 8000):
        # load from .env if present
        load_dotenv()
        self.api_key = os.environ.get(api_key_env_var)
        self._model = None
        self._has_sdk = False
        self.model_name = model_name
        self.temperature = temperature
        self.max_tokens = max_tokens
        try:
            import google.generativeai as genai
            genai.configure(api_key=self.api_key)
            self._model = genai.GenerativeModel(self.model_name)
            self._has_sdk = True
        except Exception as e:
            print(f"Warning: Could not initialize Gemini SDK: {e}")
            self._has_sdk = False

    def generate(self, prompt: str, temperature: float = None, max_tokens: int = None) -> Dict[str, Any]:
        """Synchronous generation interface.
        Returns a dict with keys: text, raw.
        """
        temp = temperature if temperature is not None else self.temperature
        tokens = max_tokens if max_tokens is not None else self.max_tokens
        if self._has_sdk and self._model:
            try:
                response = self._model.generate_content(
                    prompt,
                    generation_config={
                        "temperature": temp,
                        "max_output_tokens": tokens,
                        "top_p": 0.95,
                    }
                )
                return {"text": response.text, "raw": response}
            except Exception as e:
                print(f"Warning: Gemini call failed: {e}")
                return self._mock_response(prompt)
        return self._mock_response(prompt)
    def list_models(self):
        """List available Gemini models if SDK is available."""
        if self._has_sdk:
            try:
                import google.generativeai as genai
                return genai.list_models()
            except Exception as e:
                print(f"Error listing models: {e}")
        return []

    def _mock_response(self, prompt: str) -> Dict[str, Any]:
        """Return a mock response with JSON-like content for testing."""
        if "schedule" in prompt.lower():
            return {
                "text": '{"intent": "plan_schedule", "parameters": {"time_range": "evening", "priority": "high"}}',
                "raw": {"prompt": prompt}
            }
        return {
            "text": '{"message": "I suggest scheduling DSA in the evening.", "concerns": ["Late night study session"]}',
            "raw": {"prompt": prompt}
        }
