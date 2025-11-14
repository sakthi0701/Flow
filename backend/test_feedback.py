"""Test the feedback and learning system."""
import os
from datetime import datetime, timedelta

from feedback import TaskFeedback, FeedbackStore
from memory.local_memory import LocalMemory


def main():
    # Initialize memory with feedback
    mem = LocalMemory("sample_data/memory.json")
    
    # Create some sample task feedback
    now = datetime.now()
    feedback_data = [
        # Morning study session - low energy, incomplete
        TaskFeedback(
            task_id="morning_study_1",
            scheduled_start=now.replace(hour=8, minute=0),
            scheduled_end=now.replace(hour=10, minute=0),
            actual_start=now.replace(hour=8, minute=15),
            actual_end=None,
            completed=False,
            energy_level=2,
            difficulty=4,
            satisfaction=2,
            notes="Too tired for morning study"
        ),
        # Afternoon session - better performance
        TaskFeedback(
            task_id="afternoon_study_1",
            scheduled_start=now.replace(hour=14, minute=0),
            scheduled_end=now.replace(hour=16, minute=0),
            actual_start=now.replace(hour=14, minute=0),
            actual_end=now.replace(hour=16, minute=30),
            completed=True,
            energy_level=4,
            difficulty=4,
            satisfaction=4,
            notes="Good focus in afternoon"
        ),
        # Evening session - moderate performance
        TaskFeedback(
            task_id="evening_study_1",
            scheduled_start=now.replace(hour=19, minute=0),
            scheduled_end=now.replace(hour=21, minute=0),
            actual_start=now.replace(hour=19, minute=0),
            actual_end=now.replace(hour=20, minute=30),
            completed=True,
            energy_level=3,
            difficulty=3,
            satisfaction=3,
            notes="Decent evening session but getting tired"
        )
    ]
    
    # Add feedback to memory
    user_id = "test_user"
    for feedback in feedback_data:
        mem.add_feedback(user_id, feedback)
    
    # Get scheduling insights
    insights = mem.get_scheduling_insights(user_id)
    
    print("\nScheduling Recommendations:")
    print("-" * 60)
    for rec in insights["recommendations"]:
        print(f"\nType: {rec['type']}")
        print(f"Message: {rec['message']}")
        print(f"Suggestion: {rec['suggestion']}")
    
    # Test schedule weighting
    test_schedule = [
        {
            "title": "Morning Study",
            "category": "study",
            "startTime": (now + timedelta(days=1)).replace(hour=8, minute=0).isoformat(),
            "endTime": (now + timedelta(days=1)).replace(hour=10, minute=0).isoformat()
        },
        {
            "title": "Afternoon Study",
            "category": "study",
            "startTime": (now + timedelta(days=1)).replace(hour=14, minute=0).isoformat(),
            "endTime": (now + timedelta(days=1)).replace(hour=16, minute=0).isoformat()
        }
    ]
    
    weighted_schedule = mem.adjust_schedule_weights(user_id, test_schedule)
    
    print("\nSchedule Weights:")
    print("-" * 60)
    for task in weighted_schedule:
        print(f"\nTask: {task['title']}")
        print(f"Time: {task['startTime']}")
        print(f"Weight: {task.get('slot_weight', 1.0):.2f}")


if __name__ == "__main__":
    main()