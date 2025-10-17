from datetime import datetime, timedelta
from typing import Dict, Any, List, Tuple
from .base import Agent


class AllocatorAgent(Agent):
    name = "allocator"

    def _categorize_tasks(self, tasks: List[Dict]) -> Tuple[List[Dict], List[Dict], List[Dict], List[Dict]]:
        """Categorize tasks using Eisenhower matrix."""
        urgent_important = []
        not_urgent_important = []
        urgent_not_important = []
        not_urgent_not_important = []

        for task in tasks:
            is_urgent = task.get("urgent", False)
            is_important = task.get("important", False)

            if is_urgent and is_important:
                urgent_important.append(task)
            elif not is_urgent and is_important:
                not_urgent_important.append(task)
            elif is_urgent and not is_important:
                urgent_not_important.append(task)
            else:
                not_urgent_not_important.append(task)

        # Sort each category by estimated duration (shorter tasks first)
        for category in [urgent_important, not_urgent_important, 
                        urgent_not_important, not_urgent_not_important]:
            category.sort(key=lambda x: x.get("estimatedMinutes", 60))

        return (urgent_important, not_urgent_important, 
                urgent_not_important, not_urgent_not_important)

    def _find_best_slot(self, task: Dict, available_slots: List[Dict], 
                        preferences: Dict) -> Dict:
        """Find the best available slot for a task considering preferences."""
        task_duration = task.get("estimatedMinutes", 60) / 60  # Convert to hours
        task_category = task.get("category", "")
        preferred_time = preferences.get(f"preferred_{task_category}_time", "")

        best_slot = None
        min_score = float('inf')

        for slot in available_slots:
            if slot["duration"] < task_duration:
                continue

            slot_start = datetime.fromisoformat(slot["startTime"])
            
            # Score the slot (lower is better)
            score = 0
            
            # Prefer slots that closely match the task duration
            score += abs(slot["duration"] - task_duration)
            
            # Prefer slots that match category preferences
            if preferred_time:
                preferred_hour = int(preferred_time.split(":")[0])
                if abs(slot_start.hour - preferred_hour) > 2:
                    score += 2
            
            if score < min_score:
                min_score = score
                best_slot = slot

        return best_slot

    def _allocate_breaks(self, schedule: List[Dict], preferences: Dict) -> List[Dict]:
        """Add breaks between tasks based on preferences."""
        if not schedule:
            return schedule

        break_duration = preferences.get("breakDuration", 15)
        min_work_block = preferences.get("minWorkBlock", 45)
        
        enhanced_schedule = []
        last_end = None

        for event in schedule:
            start = datetime.fromisoformat(event["startTime"])
            
            if last_end:
                work_duration = (start - last_end).total_seconds() / 60
                if work_duration >= min_work_block:
                    break_start = last_end
                    break_end = break_start + timedelta(minutes=break_duration)
                    if break_end < start:
                        enhanced_schedule.append({
                            "title": "Break",
                            "category": "break",
                            "startTime": break_start.isoformat(),
                            "endTime": break_end.isoformat()
                        })

            enhanced_schedule.append(event)
            last_end = datetime.fromisoformat(event["endTime"])

        return enhanced_schedule

    def run(self, state: Dict[str, Any]) -> Dict[str, Any]:
        """Allocate tasks to available time slots using Eisenhower prioritization."""
        tasks = state.get("tasks", [])
        available_slots = state.get("availableSlots", [])
        preferences = state.get("preferences", {})
        
        if not tasks or not available_slots:
            state["schedule"] = []
            return state

        # Categorize tasks using Eisenhower matrix
        (urgent_important, not_urgent_important,
         urgent_not_important, not_urgent_not_important) = self._categorize_tasks(tasks)

        # Combine all tasks in priority order
        all_tasks = (urgent_important + not_urgent_important + 
                    urgent_not_important + not_urgent_not_important)

        schedule = []
        remaining_slots = available_slots.copy()

        # Allocate tasks to slots
        for task in all_tasks:
            best_slot = self._find_best_slot(task, remaining_slots, preferences)
            if not best_slot:
                continue

            # Calculate task end time
            task_duration = task.get("estimatedMinutes", 60)
            start_time = datetime.fromisoformat(best_slot["startTime"])
            end_time = start_time + timedelta(minutes=task_duration)

            # Create schedule entry
            schedule_entry = {
                "title": task["title"],
                "category": task["category"],
                "startTime": start_time.isoformat(),
                "endTime": end_time.isoformat(),
                "priority": "high" if task in urgent_important else "medium" if task in not_urgent_important else "low"
            }
            schedule.append(schedule_entry)

            # Update the slot
            remaining_duration = (datetime.fromisoformat(best_slot["endTime"]) - end_time).total_seconds() / 3600
            if remaining_duration >= 0.5:  # If there's still 30+ minutes
                remaining_slots.append({
                    "startTime": end_time.isoformat(),
                    "endTime": best_slot["endTime"],
                    "duration": remaining_duration
                })
            remaining_slots.remove(best_slot)

        # Add breaks between tasks
        schedule = self._allocate_breaks(sorted(schedule, key=lambda x: x["startTime"]), preferences)

        state["schedule"] = schedule
        return state
