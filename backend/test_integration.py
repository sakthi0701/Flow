"""Test the integration endpoints for file-based API."""
from integration import get_schedule, update_task, add_goal, chat_command
from memory.local_memory import LocalMemory


def main():
    user_id = "test_user"
    memory = LocalMemory("sample_data/memory.json")

    # Add a task
    update_task(user_id, {
        "title": "Finish AI project",
        "estimatedMinutes": 120,
        "category": "project",
        "urgent": True,
        "important": True
    }, memory)

    # Add a goal
    add_goal(user_id, {
        "title": "Ace the final exam",
        "deadline": "2025-10-25"
    }, memory)

    # Get a schedule
    result = get_schedule(user_id, "Plan my week for finals", memory)
    print("\nGenerated Schedule:")
    print("-" * 60)
    for event in result.get("schedule", []):
        print(f"{event['title']} | {event['startTime']} - {event['endTime']}")

    # Test chat command
    chat_result = chat_command(user_id, "What should I focus on this weekend?", memory)
    print("\nChat Command Result:")
    print("-" * 60)
    print(chat_result)


if __name__ == "__main__":
    main()
