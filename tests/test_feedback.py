"""Unit tests for feedback and learning system."""
# NOTE: If you see 'Import "pytest" could not be resolved', run: pip install pytest
import pytest
from datetime import datetime
from feedback import TaskFeedback
from memory.local_memory import LocalMemory

@pytest.fixture
def memory():
    return LocalMemory("sample_data/memory.json")

def test_add_and_retrieve_feedback(memory):
    user_id = "test_user"
    now = datetime.now()
    feedback = TaskFeedback(
        task_id="test_task",
        scheduled_start=now.replace(hour=10, minute=0),
        scheduled_end=now.replace(hour=12, minute=0),
        actual_start=now.replace(hour=10, minute=5),
        actual_end=now.replace(hour=11, minute=55),
        completed=True,
        energy_level=4,
        difficulty=3,
        satisfaction=4,
        notes="Felt good about this session"
    )
    memory.add_feedback(user_id, feedback)
    insights = memory.get_scheduling_insights(user_id)
    assert "recommendations" in insights
    assert "time_slots" in insights
    assert any(isinstance(v, dict) for v in insights["time_slots"].values())

def test_schedule_weighting(memory):
    user_id = "test_user"
    now = datetime.now()
    # Add feedback for a morning slot with low completion
    feedback = TaskFeedback(
        task_id="morning_fail",
        scheduled_start=now.replace(hour=8, minute=0),
        scheduled_end=now.replace(hour=9, minute=0),
        actual_start=now.replace(hour=8, minute=0),
        actual_end=None,
        completed=False,
        energy_level=2,
        difficulty=4,
        satisfaction=2,
        notes="Missed due to tiredness"
    )
    memory.add_feedback(user_id, feedback)
    # Test weighting
    test_schedule = [
        {
            "title": "Morning Study",
            "category": "study",
            "startTime": now.replace(hour=8, minute=0).isoformat(),
            "endTime": now.replace(hour=9, minute=0).isoformat()
        }
    ]
    weighted = memory.adjust_schedule_weights(user_id, test_schedule)
    assert "slot_weight" in weighted[0]
    assert weighted[0]["slot_weight"] < 1.0  # Should be penalized for low completion
