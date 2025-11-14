"""Integration endpoints for file-based API commands."""
import json
from typing import Dict, Any, Optional
from memory.local_memory import LocalMemory
from flow_ai_router import run_agent_chain
from agents.parser import ParserAgent
from agents.constraint import ConstraintAgent
from agents.allocator import AllocatorAgent
from agents.coach import CoachAgent

# You can add more agents as needed

def _clean_state_for_json(state: Dict[str, Any]) -> Dict[str, Any]:
    """Remove non-serializable items from the state for JSON conversion."""
    cleaned_state = {}
    for key, value in state.items():
        try:
            # This is a simple check to see if the value is JSON serializable
            json.dumps(value)
            cleaned_state[key] = value
        except (TypeError, OverflowError):
            # Skip non-serializable items (like agent instances)
            pass
    return cleaned_state

def get_schedule(user_id: str, query: str, memory: Optional[LocalMemory] = None) -> Dict[str, Any]:
    """Generate a schedule for the user based on their query and memory."""
    if memory is None:
        memory = LocalMemory("sample_data/memory.json")
    
    agents = [ParserAgent(), ConstraintAgent(), AllocatorAgent(), CoachAgent()]
    
    # Retrieve all data for the user from memory
    all_user_data = memory.retrieve(user_id=user_id, query="")
    
    # Filter the data into tasks, fixed events, and preferences
    tasks = [item['item'] for item in all_user_data if isinstance(item, dict) and item.get('item', {}).get('type') == 'task']
    # Assuming preferences are stored in a specific format; for now, we'll look for a 'preferences' key
    preferences = [item['item'] for item in all_user_data if isinstance(item, dict) and 'break_ratio' in item.get('item', {})]
    
    # For fixedEvents, you might have another type or a different way to identify them.
    # We will assume for now they might not be in memory and could be passed in the query.
    fixed_events = [item['item'] for item in all_user_data if isinstance(item, dict) and item.get('item', {}).get('type') == 'fixedEvent']


    initial_state = {
        "user_id": user_id,
        "query": query,
        "tasks": tasks,
        "fixedEvents": fixed_events,
        "preferences": preferences[0] if preferences else {}
    }

    result_state = run_agent_chain(initial_state, agents, memory)
    return _clean_state_for_json(result_state)

def update_task(user_id: str, task: Dict[str, Any], memory: Optional[LocalMemory] = None) -> None:
    """Update or add a task for the user."""
    if memory is None:
        memory = LocalMemory("sample_data/memory.json")
    memory.persist(user_id, {"type": "task", **task})

def add_goal(user_id: str, goal: Dict[str, Any], memory: Optional[LocalMemory] = None) -> None:
    """Add a new goal for the user."""
    if memory is None:
        memory = LocalMemory("sample_data/memory.json")
    memory.persist(user_id, {"type": "goal", **goal})

def chat_command(user_id: str, command: str, memory: Optional[LocalMemory] = None) -> Dict[str, Any]:
    """Process a chat command (general interface for LLM-based actions)."""
    if memory is None:
        memory = LocalMemory("sample_data/memory.json")
    
    agents = [ParserAgent(), ConstraintAgent(), AllocatorAgent(), CoachAgent()]
    initial_state = {"user_id": user_id, "query": command}
    result_state = run_agent_chain(initial_state, agents, memory)
    return _clean_state_for_json(result_state)