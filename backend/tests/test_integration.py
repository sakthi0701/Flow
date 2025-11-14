"""Unit tests for integration endpoints."""
from integration import get_schedule, update_task, add_goal, chat_command
from memory.local_memory import LocalMemory

def test_update_and_get_schedule():
    user_id = "test_user"
    memory = LocalMemory("sample_data/memory.json")
    update_task(user_id, {
        "title": "Write report",
        "estimatedMinutes": 60,
        "category": "work",
        "urgent": True,
        "important": True
    }, memory)
    result = get_schedule(user_id, "Schedule my work tasks", memory)
    assert "schedule" in result
    assert any(e["title"] == "Write report" for e in result["schedule"])

def test_add_goal():
    user_id = "test_user"
    memory = LocalMemory("sample_data/memory.json")
    add_goal(user_id, {
        "title": "Finish reading book",
        "deadline": "2025-10-30"
    }, memory)
    # No assertion needed, just ensure no error

def test_chat_command():
    user_id = "test_user"
    memory = LocalMemory("sample_data/memory.json")
    result = chat_command(user_id, "What should I focus on this weekend?", memory)
    assert isinstance(result, dict)
