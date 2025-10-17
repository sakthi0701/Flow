"""JSON response validation and retry logic for LLM outputs."""
from typing import Dict, Any, Optional, Tuple
import json
from pydantic import ValidationError, BaseModel

from prompts import (
    LLMResponse, ParsedResponse, ConstraintResponse,
    AllocationResponse, CoachResponse
)


class ResponseValidator:
    """Validates and cleans LLM responses with retry logic."""
    
    @staticmethod
    def extract_json(response: str) -> Tuple[Optional[Dict[str, Any]], Optional[str]]:
        """Extract JSON from LLM response text."""
        try:
            # Find JSON boundaries
            start = response.find('{')
            end = response.rfind('}') + 1
            
            if start == -1 or end == 0:
                return None, "No JSON found in response"
                
            json_str = response[start:end]
            data = json.loads(json_str)
            return data, None
            
        except json.JSONDecodeError as e:
            return None, f"JSON decode error: {str(e)}"
        except Exception as e:
            return None, f"Unexpected error extracting JSON: {str(e)}"

    @classmethod
    def validate(cls, 
                response: str,
                model: type[BaseModel]) -> Tuple[Optional[Dict[str, Any]], Optional[str]]:
        """Validate response against a Pydantic model."""
        # Extract JSON first
        data, error = cls.extract_json(response)
        if error:
            return None, error
            
        try:
            # Validate with Pydantic model
            validated = model(**data)
            return validated.dict(exclude_none=True), None
            
        except ValidationError as e:
            return None, f"Validation error: {str(e)}"
        except Exception as e:
            return None, f"Unexpected validation error: {str(e)}"

    @classmethod
    def clean_and_validate(cls,
                          response: str,
                          agent_type: str) -> Tuple[Optional[Dict[str, Any]], Optional[str]]:
        """Clean and validate response based on agent type."""
        # Map agent types to response models
        model_map = {
            "parser": ParsedResponse,
            "constraint": ConstraintResponse,
            "allocator": AllocationResponse,
            "coach": CoachResponse
        }
        
        model = model_map.get(agent_type, LLMResponse)
        return cls.validate(response, model)


def validate_llm_response(response: str,
                         agent_type: str,
                         max_retries: int = 3) -> Dict[str, Any]:
    """Validate LLM response with retries.
    
    Args:
        response: Raw LLM response text
        agent_type: Type of agent ("parser", "constraint", "allocator", "coach")
        max_retries: Maximum number of retry attempts
        
    Returns:
        Validated response dict or error dict
    """
    validator = ResponseValidator()
    
    for attempt in range(max_retries):
        data, error = validator.clean_and_validate(response, agent_type)
        
        if data and not error:
            return data
            
        if attempt < max_retries - 1:
            # Could implement exponential backoff here if needed
            continue
            
    # If we exhausted retries, return error state
    return {
        "error": error or "Maximum retry attempts reached",
        "raw_response": response
    }