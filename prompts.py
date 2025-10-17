"""Prompt templates for agents and LLM response validation."""
import json
from datetime import datetime, timedelta
from typing import Dict, Any, Optional, List, Union
from pydantic import BaseModel, Field, ValidationError


class LLMResponse(BaseModel):
    """Base model for LLM responses."""
    error: Optional[str] = None

class ParsedResponse(LLMResponse):
    """Parser agent response format."""
    intent: str = Field(..., description="The interpreted scheduling intent")
    parameters: Dict[str, Any] = Field(default_factory=dict)
    
class ConstraintResponse(LLMResponse):
    """Constraint agent response format."""
    constraints: List[Dict[str, Any]] = Field(default_factory=list)
    suggestions: List[str] = Field(default_factory=list)
    
class AllocationResponse(LLMResponse):
    """Allocator agent response format."""
    schedule: List[Dict[str, Any]] = Field(default_factory=list)
    rationale: Optional[str] = None
    
class CoachResponse(LLMResponse):
    """Coach agent response format."""
    message: str = Field(..., description="Encouraging feedback message")
    concerns: List[str] = Field(default_factory=list)
    suggestions: List[str] = Field(default_factory=list)


class AgentPromptTemplate:
    """Base class for agent prompts with validation and retry logic."""
    
    max_retries: int = 3
    response_model: type[LLMResponse] = LLMResponse
    
    @classmethod
    def format(cls, **kwargs) -> str:
        raise NotImplementedError
    
    @classmethod
    def validate_response(cls, response: str) -> Union[Dict[str, Any], None]:
        """Validate and clean LLM response."""
        try:
            # Extract JSON from response (handle cases where LLM adds extra text)
            start = response.find('{')
            end = response.rfind('}') + 1
            if start == -1 or end == 0:
                return None
                
            json_str = response[start:end]
            data = json.loads(json_str)
            
            # Validate against Pydantic model
            validated = cls.response_model(**data)
            return validated.dict(exclude_none=True)
            
        except (json.JSONDecodeError, ValidationError) as e:
            return {"error": str(e)}
            
        except Exception as e:
            return {"error": f"Unexpected error: {str(e)}"}


class ParserPromptTemplate(AgentPromptTemplate):
    response_model = ParsedResponse
    
    template = '''Given the user request and their schedule context, extract the key scheduling intent and parameters.
Context: {context}

Request: {query}

Expected intents:
- schedule_task: Create a schedule for specific tasks
- plan_exam: Plan study schedule around exams
- reschedule: Move existing tasks
- update_preferences: Modify scheduling preferences
- add_goal: Add a new goal or milestone
- general_advice: General scheduling advice

Format your response as JSON with these fields:
{{
    "intent": "schedule_task" | "plan_exam" | "reschedule" | "update_preferences" | "add_goal" | "general_advice",
    "parameters": {{
        "date_range": "optional date range for scheduling",
        "subjects": ["list of subjects if mentioned"],
        "priority": "high|medium|low if specified",
        "duration": "duration if mentioned",
        "specific_times": ["any specific times mentioned"],
        "preferences": {{ "any preference updates mentioned" }}
    }}
}}

Return your response in JSON format:'''

    @classmethod
    def format(cls, context: list, query: str) -> str:
        context_str = "\n".join(f"- {c}" for c in (context or []))
        return cls.template.format(context=context_str, query=query)


class ConstraintPromptTemplate(AgentPromptTemplate):
    response_model = ConstraintResponse
    
    template = '''Analyze the schedule constraints and conflicts.

Fixed Events:
{fixed_events}

Tasks to Schedule:
{tasks}

User Preferences:
{preferences}

Identify scheduling constraints and provide suggestions. Format as JSON:
{{
    "constraints": [
        {{
            "type": "time_conflict" | "energy_level" | "preference_mismatch",
            "description": "Details about the constraint",
            "affected_items": ["items affected by this constraint"]
        }}
    ],
    "suggestions": [
        "Specific suggestions to resolve constraints"
    ]
}}

Response (JSON only):'''

    @classmethod
    def format(cls, fixed_events: List[Dict], tasks: List[Dict], preferences: Dict) -> str:
        return cls.template.format(
            fixed_events=json.dumps(fixed_events, indent=2),
            tasks=json.dumps(tasks, indent=2),
            preferences=json.dumps(preferences, indent=2)
        )


class AllocatorPromptTemplate(AgentPromptTemplate):
    response_model = AllocationResponse
    
    template = '''Create an optimal schedule allocation for the given tasks and available slots.

Available Slots:
{available_slots}

Tasks to Schedule:
{tasks}

User Preferences:
{preferences}

Format your response as JSON:
{{
    "schedule": [
        {{
            "task_id": "ID of the task",
            "slot_id": "ID of the chosen slot",
            "rationale": "Why this slot was chosen"
        }}
    ],
    "rationale": "Overall scheduling strategy explanation"
}}

Response (JSON only):'''

    @classmethod
    def format(cls, available_slots: List[Dict], tasks: List[Dict], preferences: Dict) -> str:
        return cls.template.format(
            available_slots=json.dumps(available_slots, indent=2),
            tasks=json.dumps(tasks, indent=2),
            preferences=json.dumps(preferences, indent=2)
        )


class CoachPromptTemplate(AgentPromptTemplate):
    response_model = CoachResponse
    
    template = '''Review the schedule and provide encouraging feedback with any concerns or suggestions.

Context:
{context}

Schedule:
{schedule}

User Preferences:
{preferences}

Format your response as JSON:
{{
    "message": "An encouraging message about the schedule",
    "concerns": [
        "Potential issues to watch out for"
    ],
    "suggestions": [
        "Constructive suggestions for improvement"
    ]
}}

Response (JSON only):'''

    @classmethod
    def format(cls, context: List[str], schedule: List[Dict], preferences: Dict) -> str:
        return cls.template.format(
            context="\n".join(f"- {c}" for c in context),
            schedule=json.dumps(schedule, indent=2),
            preferences=json.dumps(preferences, indent=2)
        )
        schedule_str = json.dumps(schedule, indent=2)
        return cls.template.format(context=context_str, schedule=schedule_str)



class LLMResponse(BaseModel):
    """Base model for validating LLM JSON responses."""
    raw_text: str = Field(description="The raw text response from the LLM")
    parsed: Optional[Dict[str, Any]] = Field(None, description="Parsed JSON if available")
    error: Optional[str] = Field(None, description="Error message if JSON parsing failed")


def parse_llm_response(text: str) -> LLMResponse:
    """Parse and validate LLM response text, attempting to extract JSON."""
    resp = LLMResponse(raw_text=text)
    
    # find JSON-like content (basic heuristic)
    start = text.find("{")
    end = text.rfind("}")
    if start >= 0 and end > start:
        json_text = text[start:end + 1]
        try:
            resp.parsed = json.loads(json_text)
        except json.JSONDecodeError as e:
            resp.error = f"Failed to parse JSON: {str(e)}"
    else:
        resp.error = "No JSON-like content found in response"
    
    return resp