"""Unit tests for integration endpoints."""
import os
import tempfile
from integration import get_schedule, update_task, add_goal, chat_command
from memory.local_memory import LocalMemory

def test_update_and_get_schedule():
    # Create a temporary memory file for testing
    with tempfile.NamedTemporaryFile(mode='w', suffix='.json', delete=False) as f:
        temp_memory_path = f.name
        f.write('{"memories": [], "user_feedback": {}}')
    
    try:
        user_id = "test_user"
        memory = LocalMemory(temp_memory_path)
        update_task(user_id, {
            "title": "Write report",
            "estimatedMinutes": 60,
            "category": "work",
            "urgent": True,
            "important": True
        }, memory)
        
        # Add a fixed event to create available slots
        memory.persist(user_id, {
            "type": "fixedEvent",
            "title": "Meeting",
            "startTime": "2025-10-18T10:00:00",
            "endTime": "2025-10-18T11:00:00"
        })
        
        result = get_schedule(user_id, "Schedule my work tasks", memory)
        print("Result:", result)
        assert "schedule" in result
        assert any(e["title"] == "Write report" for e in result["schedule"])
    finally:
        # Clean up the temporary file
        os.unlink(temp_memory_path)

def test_add_goal():
    # Create a temporary memory file for testing
    with tempfile.NamedTemporaryFile(mode='w', suffix='.json', delete=False) as f:
        temp_memory_path = f.name
        f.write('{"memories": [], "user_feedback": {}}')
    
    try:
        user_id = "test_user"
        memory = LocalMemory(temp_memory_path)
        add_goal(user_id, {
            "title": "Finish reading book",
            "deadline": "2025-10-30"
        }, memory)
        # No assertion needed, just ensure no error
    finally:
        # Clean up the temporary file
        os.unlink(temp_memory_path)

def test_chat_command():
    # Create a temporary memory file for testing
    with tempfile.NamedTemporaryFile(mode='w', suffix='.json', delete=False) as f:
        temp_memory_path = f.name
        f.write('{"memories": [], "user_feedback": {}}')
    
    try:
        user_id = "test_user"
        memory = LocalMemory(temp_memory_path)
        result = chat_command(user_id, "What should I focus on this weekend?", memory)
        assert isinstance(result, dict)
    finally:
        # Clean up the temporary file
        os.unlink(temp_memory_path)