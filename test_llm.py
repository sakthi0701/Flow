"""Run tests for LLM client with prompt templates and response validation."""
import os
import sys
from datetime import datetime, timedelta
from typing import Dict, Any

# ensure project root is on sys.path
ROOT = os.path.dirname(__file__)
if ROOT not in sys.path:
    sys.path.insert(0, ROOT)

from llm_client import LLMClient
from prompts import (
    ParserPromptTemplate, 
    ConstraintPromptTemplate,
    AllocatorPromptTemplate,
    CoachPromptTemplate
)
from validators import validate_llm_response


def test_agent_prompt(client: LLMClient,
                     template: Any,
                     agent_type: str,
                     template_args: Dict[str, Any]) -> None:
    """Test an agent prompt template and validate response."""
    # Format prompt and generate response
    prompt = template.format(**template_args)
    print(f"\n{agent_type.title()} Agent Prompt:")
    print("-" * 60)
    print(prompt)
    
    # Get and validate LLM response
    response = client.generate(prompt)
    validated = validate_llm_response(response["text"], agent_type)
    
    print(f"\n{agent_type.title()} Agent Response:")
    print("-" * 60)
    if "error" in validated:
        print(f"Error: {validated['error']}")
    else:
        print("Validated Response:")
        for key, value in validated.items():
            print(f"{key}: {value}")


def main():
    client = LLMClient()
    
    # Test data
    now = datetime.now()
    tomorrow = now + timedelta(days=1)
    
    context = [
        "User prefers DSA practice after 20:00",
        "Often misses morning sessions on weekends",
        "Has exam preparation next week"
    ]
    
    fixed_events = [
        {
            "title": "Algorithm Exam",
            "startTime": tomorrow.replace(hour=14, minute=0).isoformat(),
            "endTime": tomorrow.replace(hour=16, minute=0).isoformat(),
            "category": "exam"
        }
    ]
    
    tasks = [
        {
            "title": "DSA Final Review",
            "estimatedMinutes": 120,
            "category": "study",
            "urgent": True,
            "important": True
        },
        {
            "title": "Practice Problems",
            "estimatedMinutes": 90,
            "category": "study",
            "urgent": False,
            "important": True
        }
    ]
    
    preferences = {
        "workDayStart": "09:00",
        "workDayEnd": "22:00",
        "breakDuration": 15,
        "minWorkBlock": 45,
        "preferred_study_time": "14:00",
        "energy_levels": {
            "morning": "medium",
            "afternoon": "high",
            "evening": "medium",
            "night": "low"
        }
    }
    
    schedule = [
        {
            "title": "DSA practice",
            "startTime": now.replace(hour=20, minute=0).isoformat(),
            "endTime": now.replace(hour=21, minute=30).isoformat(),
            "category": "study"
        },
        {
            "title": "Physics revision",
            "startTime": now.replace(hour=21, minute=40).isoformat(),
            "endTime": now.replace(hour=23, minute=40).isoformat(),
            "category": "study"
        }
    ]
    
    # Test each agent
    test_agent_prompt(
        client, 
        ParserPromptTemplate,
        "parser",
        {"context": context, "query": "Schedule DSA practice for 2 hours tonight"}
    )
    
    test_agent_prompt(
        client,
        ConstraintPromptTemplate,
        "constraint",
        {"fixed_events": fixed_events, "tasks": tasks, "preferences": preferences}
    )
    
    test_agent_prompt(
        client,
        AllocatorPromptTemplate,
        "allocator",
        {
            "available_slots": [
                {
                    "startTime": now.replace(hour=17).isoformat(),
                    "endTime": now.replace(hour=19).isoformat(),
                    "duration": 2.0
                }
            ],
            "tasks": tasks,
            "preferences": preferences
        }
    )
    
    test_agent_prompt(
        client,
        CoachPromptTemplate,
        "coach",
        {"context": context, "schedule": schedule, "preferences": preferences}
    )


if __name__ == "__main__":
    main()