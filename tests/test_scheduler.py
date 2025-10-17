"""Unit tests for core scheduling logic and agent chain."""
# NOTE: If you see 'Import "pytest" could not be resolved', run: pip install pytest
import pytest
from memory.local_memory import LocalMemory
from flow_ai_router import run_agent_chain
from agents.parser import ParserAgent
from agents.constraint import ConstraintAgent
from agents.allocator import AllocatorAgent
from agents.coach import CoachAgent

@pytest.fixture
def memory():
    return LocalMemory("sample_data/memory.json")

@pytest.fixture
def agent_chain():
    return [ParserAgent(), ConstraintAgent(), AllocatorAgent(), CoachAgent()]


def test_happy_path(memory, agent_chain):
    initial_state = {
        "user_id": "test_user",
        "query": "Schedule my week for exams",
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
    result = run_agent_chain(initial_state, agent_chain, memory)
    assert "schedule" in result
    assert any(e["title"] == "Math Review" for e in result["schedule"])
    assert any(e["title"] == "Physics Practice Problems" for e in result["schedule"])


def test_conflict_case(memory, agent_chain):
    initial_state = {
        "user_id": "test_user",
        "query": "Schedule two overlapping events",
        "fixedEvents": [
            {
                "title": "Morning Meeting",
                "startTime": "2025-10-18T09:00:00",
                "endTime": "2025-10-18T11:00:00",
                "category": "meeting"
            },
            {
                "title": "Doctor Appointment",
                "startTime": "2025-10-18T10:30:00",
                "endTime": "2025-10-18T11:30:00",
                "category": "appointment"
            }
        ],
        "tasks": [
            {
                "title": "Project Work",
                "estimatedMinutes": 60,
                "category": "work",
                "urgent": True,
                "important": True
            }
        ],
        "preferences": {
            "workDayStart": "08:00",
            "workDayEnd": "18:00",
            "breakDuration": 10,
            "minWorkBlock": 30
        }
    }
    result = run_agent_chain(initial_state, agent_chain, memory)
    assert "schedule" in result
    # Should not schedule Project Work during the conflict
    for event in result["schedule"]:
        if event["title"] == "Project Work":
            assert not (
                ("2025-10-18T09:00:00" <= event["startTime"] < "2025-10-18T11:30:00")
            )
