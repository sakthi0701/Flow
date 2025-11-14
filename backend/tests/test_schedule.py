import json
import os
from flow_ai_router import run_agent_chain
from agents.parser import ParserAgent
from agents.allocator import AllocatorAgent
from memory.local_memory import LocalMemory


def load_sample_tasks():
    # Use relative paths
    sample_path = os.path.join(os.path.dirname(__file__), "..", "sample_data", "sample.json")
    with open(sample_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    return data


def test_allocator_creates_schedule():
    data = load_sample_tasks()
    mem_path = os.path.join(os.path.dirname(__file__), "..", "sample_data", "memory.json")
    mem = LocalMemory(mem_path)
    parser = ParserAgent()
    allocator = AllocatorAgent()

    initial_state = {
        "query": "Plan week for exams", 
        "user_id": data.get("user_id"), 
        "tasks": data.get("tasks"), 
        "fixedEvents": data.get("fixedEvents"),
        "preferences": data.get("preferences")
    }
    state = run_agent_chain(initial_state, [parser, allocator], mem)
    # allocator should attach schedule
    assert "schedule" in state
    assert isinstance(state["schedule"], list)