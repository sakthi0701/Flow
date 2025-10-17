import json
from flow_ai_router import run_agent_chain
from agents.parser import ParserAgent
from agents.allocator import AllocatorAgent
from memory.local_memory import LocalMemory


def load_sample_tasks():
    with open("f:/Flow/sample_data/sample.json", "r", encoding="utf-8") as f:
        data = json.load(f)
    return data


def test_allocator_creates_schedule():
    data = load_sample_tasks()
    mem = LocalMemory("f:/Flow/sample_data/memory.json")
    parser = ParserAgent()
    allocator = AllocatorAgent()

    state = {"query": "Plan week for exams", "user_id": data.get("user_id"), "tasks": data.get("tasks"), "fixedEvents": data.get("fixedEvents")}
    state = run_agent_chain(state["query"], [parser, allocator], mem, user_id=state["user_id"])
    # allocator should attach schedule
    assert "schedule" in state
    assert isinstance(state["schedule"], list)
