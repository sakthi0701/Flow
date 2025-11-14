"""Router to run agent chains with memory retrieval and error handling."""
from typing import List, Dict, Any

from agents.base import Agent
from memory.local_memory import LocalMemory
from context_manager import build_context


def run_agent_chain(initial_state: Dict[str, Any], agents: List[Agent], memory: LocalMemory) -> Dict[str, Any]:
    """Run an agent chain with error handling and state validation.
    
    Args:
        initial_state: Must contain at least `query` and `user_id`
        agents: List of agents to run in sequence
        memory: Memory interface for context retrieval
    
    Returns:
        Final state after all agents have processed
    """
    state = dict(initial_state)
    user_id = state.get("user_id", "default")
    query = state.get("query", "")

    # Initialize error tracking
    state["errors"] = []
    
    try:
        # Retrieve relevant memories and build context
        state["context"] = build_context(memory, user_id, query)
        
        # Run each agent in sequence
        for agent in agents:
            try:
                new_state = agent.run(state)
                
                # Validate state wasn't destroyed
                if not isinstance(new_state, dict):
                    raise ValueError(f"Agent {agent.name} returned invalid state type: {type(new_state)}")
                    
                state = new_state
                
                # Track agent completion
                state.setdefault("completed_agents", []).append(agent.name)
                
            except Exception as e:
                state["errors"].append({
                    "agent": agent.name,
                    "error": str(e),
                    "type": "agent_error"
                })
                # Continue with next agent unless fatal
                if str(e).startswith("FATAL:"):
                    break
                    
    except Exception as e:
        state["errors"].append({
            "agent": "router",
            "error": str(e),
            "type": "system_error"
        })
        
    return state


if __name__ == "__main__":
    # Test run with full agent chain
    from agents.parser import ParserAgent
    from agents.constraint import ConstraintAgent
    from agents.allocator import AllocatorAgent
    from memory.local_memory import LocalMemory

    mem = LocalMemory("f:/Flow/sample_data/memory.json")
    
    # Initialize agent chain
    parser = ParserAgent()
    constraint = ConstraintAgent()
    allocator = AllocatorAgent()
    
    # Set up initial state with test data
    initial_state = {
        "query": "Schedule my week for exams",
        "user_id": "test_user",
        "fixedEvents": [
            {
                "title": "Math Exam",
                "startTime": "2025-10-18T10:00:00",
                "endTime": "2025-10-18T12:00:00",
                "category": "exam"
            }
        ],
        "tasks": [
            {
                "title": "Math Review",
                "estimatedMinutes": 120,
                "category": "study",
                "urgent": True,
                "important": True
            },
            {
                "title": "Physics Practice Problems",
                "estimatedMinutes": 90,
                "category": "study",
                "urgent": False,
                "important": True
            }
        ],
        "preferences": {
            "workDayStart": "08:00",
            "workDayEnd": "20:00",
            "breakDuration": 15,
            "minWorkBlock": 45,
            "preferred_study_time": "14:00"
        }
    }
    
    # Run agent chain
    out = run_agent_chain(initial_state, [parser, constraint, allocator], mem)
    
    # Print results
    print("\nSchedule Results:")
    if "schedule" in out:
        for event in sorted(out["schedule"], key=lambda x: x["startTime"]):
            print(f"\n{event['title']}")
            print(f"Time: {event['startTime']} - {event['endTime']}")
            print(f"Category: {event.get('category', 'N/A')}")
            if "priority" in event:
                print(f"Priority: {event['priority']}")
    
    if out.get("errors"):
        print("\nErrors encountered:")
        for error in out["errors"]:
            print(f"{error['agent']}: {error['error']}")
