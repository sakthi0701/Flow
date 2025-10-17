"""Integration endpoints for file-based API commands."""
from typing import Dict, Any, Optional
from memory.local_memory import LocalMemory
from flow_ai_router import run_agent_chain
from agents.parser import ParserAgent
from agents.constraint import ConstraintAgent
from agents.allocator import AllocatorAgent
from agents.coach import CoachAgent

# You can add more agents as needed

def get_schedule(user_id: str, query: str, memory: Optional[LocalMemory] = None) -> Dict[str, Any]:
    """Generate a schedule for the user based on their query and memory."""
    if memory is None:
        memory = LocalMemory("sample_data/memory.json")
    agents = [ParserAgent(), ConstraintAgent(), AllocatorAgent(), CoachAgent()]
    initial_state = {"user_id": user_id, "query": query}
    return run_agent_chain(initial_state, agents, memory)

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
    # For now, just run the agent chain with the command as query
    agents = [ParserAgent(), ConstraintAgent(), AllocatorAgent(), CoachAgent()]
    initial_state = {"user_id": user_id, "query": command}
    return run_agent_chain(initial_state, agents, memory)
