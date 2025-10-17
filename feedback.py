"""Feedback data model and weighting system for schedule learning."""
from datetime import datetime
from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field


class TaskFeedback(BaseModel):
    """Feedback for a completed task."""
    task_id: str
    scheduled_start: datetime
    scheduled_end: datetime
    actual_start: Optional[datetime] = None
    actual_end: Optional[datetime] = None
    completed: bool = False
    energy_level: int = Field(..., ge=1, le=5)  # 1-5 scale
    difficulty: int = Field(..., ge=1, le=5)    # 1-5 scale
    satisfaction: int = Field(..., ge=1, le=5)  # 1-5 scale
    notes: Optional[str] = None

class TimeSlotFeedback(BaseModel):
    """Aggregated feedback for time slots."""
    hour: int = Field(..., ge=0, le=23)
    day_of_week: int = Field(..., ge=0, le=6)  # 0 = Monday
    completion_rate: float = Field(default=0.0, ge=0.0, le=1.0)
    avg_energy: float = Field(default=3.0, ge=1.0, le=5.0)
    sample_count: int = Field(default=0, ge=0)

class CategoryFeedback(BaseModel):
    """Feedback metrics for task categories."""
    category: str
    best_time_slots: List[TimeSlotFeedback]
    avg_duration_delta: float = 0.0  # difference between estimated and actual duration
    completion_rate: float = Field(default=0.0, ge=0.0, le=1.0)
    difficulty_rating: float = Field(default=3.0, ge=1.0, le=5.0)

class FeedbackStore:
    """Stores and processes task feedback to improve scheduling."""
    
    def __init__(self, memory_path: str = "feedback_store.json"):
        self.memory_path = memory_path
        self.task_feedback: Dict[str, TaskFeedback] = {}
        self.time_slots: Dict[str, TimeSlotFeedback] = {}
        self.categories: Dict[str, CategoryFeedback] = {}
        
    def add_task_feedback(self, feedback: TaskFeedback) -> None:
        """Add new task feedback and update aggregated metrics."""
        self.task_feedback[feedback.task_id] = feedback
        
        # Update time slot metrics
        slot_key = f"{feedback.scheduled_start.hour}_{feedback.scheduled_start.weekday()}"
        if slot_key not in self.time_slots:
            self.time_slots[slot_key] = TimeSlotFeedback(
                hour=feedback.scheduled_start.hour,
                day_of_week=feedback.scheduled_start.weekday()
            )
        
        slot = self.time_slots[slot_key]
        slot.sample_count += 1
        slot.completion_rate = (
            (slot.completion_rate * (slot.sample_count - 1) + int(feedback.completed))
            / slot.sample_count
        )
        slot.avg_energy = (
            (slot.avg_energy * (slot.sample_count - 1) + feedback.energy_level)
            / slot.sample_count
        )
        
    def get_slot_weight(self, hour: int, day: int, category: str) -> float:
        """Calculate scheduling weight for a time slot."""
        slot_key = f"{hour}_{day}"
        slot = self.time_slots.get(slot_key)
        
        if not slot:
            return 1.0  # neutral weight for unknown slots
            
        # Combine completion rate and energy level
        return (slot.completion_rate * 0.6 + (slot.avg_energy / 5.0) * 0.4)
        
    def update_schedule_weights(self, schedule: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Update task scheduling weights based on feedback history."""
        weighted_schedule = []
        
        for task in schedule:
            start_time = datetime.fromisoformat(task["startTime"])
            slot_weight = self.get_slot_weight(
                start_time.hour,
                start_time.weekday(),
                task.get("category", "")
            )
            
            # Adjust task with weight
            weighted_task = dict(task)
            weighted_task["slot_weight"] = slot_weight
            weighted_schedule.append(weighted_task)
            
        return weighted_schedule
        
    def get_category_insights(self, category: str) -> Optional[CategoryFeedback]:
        """Get aggregated insights for a task category."""
        return self.categories.get(category)
        
    def generate_scheduling_recommendations(self) -> List[Dict[str, Any]]:
        """Generate scheduling recommendations based on feedback history."""
        recommendations = []
        
        # Analyze completion patterns
        for slot_key, slot in self.time_slots.items():
            if slot.completion_rate < 0.5 and slot.sample_count >= 3:
                recommendations.append({
                    "type": "time_slot_warning",
                    "message": f"Low completion rate ({slot.completion_rate:.0%}) for {slot.hour:02d}:00 on {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][slot.day_of_week]}",
                    "suggestion": "Consider rescheduling important tasks away from this time slot"
                })
            
            if slot.avg_energy < 2.5 and slot.sample_count >= 3:
                recommendations.append({
                    "type": "energy_warning",
                    "message": f"Consistently low energy ({slot.avg_energy:.1f}/5) at {slot.hour:02d}:00",
                    "suggestion": "Schedule lighter tasks during this time"
                })
                
        return recommendations