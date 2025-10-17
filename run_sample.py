"""Run a simple sample flow to validate agents and memory."""
import sys
import os
import json

# ensure project root is on sys.path
ROOT = os.path.dirname(__file__)
if ROOT not in sys.path:
    sys.path.insert(0, ROOT)

from flow_ai_router import run_agent_chain
from agents.parser import ParserAgent
from agents.allocator import AllocatorAgent
from memory.local_memory import LocalMemory


def main():
    sample_path = os.path.join(ROOT, "sample_data", "sample.json")
    with open(sample_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    mem_path = os.path.join(ROOT, "sample_data", "memory.json")
    mem = LocalMemory(mem_path)

    parser = ParserAgent()
    allocator = AllocatorAgent()

    state = {"query": "Plan week for exams", "user_id": data.get("user_id"), "tasks": data.get("tasks"), "fixedEvents": data.get("fixedEvents"), "preferences": data.get("preferences")}
    result = run_agent_chain(state, [parser, allocator], mem)

    print(json.dumps(result, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
