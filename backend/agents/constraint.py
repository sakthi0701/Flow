from datetime import datetime, timedelta
from typing import List, Dict, Any

from .base import Agent


class ConstraintAgent(Agent):
    name = "constraint"

    def _check_conflicts(self, event1: Dict, event2: Dict) -> bool:
        """Check if two events overlap in time."""
        start1 = datetime.fromisoformat(event1["startTime"])
        end1 = datetime.fromisoformat(event1["endTime"])
        start2 = datetime.fromisoformat(event2["startTime"])
        end2 = datetime.fromisoformat(event2["endTime"])
        
        return (start1 < end2) and (end1 > start2)

    def _get_available_slots(self, fixed_events: List[Dict], preferences: Dict) -> List[Dict]:
        """Get available time slots between fixed events."""
        if not fixed_events:
            return []
            
        # Sort fixed events by start time
        sorted_events = sorted(fixed_events, key=lambda x: x["startTime"])
        
        # Get working hours from preferences or use defaults
        work_start = preferences.get("workDayStart", "09:00")
        work_end = preferences.get("workDayEnd", "17:00")
        
        slots = []
        current_date = datetime.fromisoformat(sorted_events[0]["startTime"]).date()
        end_date = datetime.fromisoformat(sorted_events[-1]["startTime"]).date()
        
        while current_date <= end_date:
            day_start = datetime.combine(current_date, datetime.strptime(work_start, "%H:%M").time())
            day_end = datetime.combine(current_date, datetime.strptime(work_end, "%H:%M").time())
            
            # Filter events for current day
            day_events = [e for e in sorted_events if 
                         datetime.fromisoformat(e["startTime"]).date() == current_date]
            
            if not day_events:
                slots.append({
                    "startTime": day_start.isoformat(),
                    "endTime": day_end.isoformat(),
                    "duration": (day_end - day_start).total_seconds() / 3600
                })
                current_date += timedelta(days=1)
                continue
                
            # Find gaps between fixed events
            current_time = day_start
            for event in day_events:
                event_start = datetime.fromisoformat(event["startTime"])
                event_end = datetime.fromisoformat(event["endTime"])
                
                if current_time < event_start:
                    duration = (event_start - current_time).total_seconds() / 3600
                    if duration >= 0.5:  # Only include slots >= 30 minutes
                        slots.append({
                            "startTime": current_time.isoformat(),
                            "endTime": event_start.isoformat(),
                            "duration": duration
                        })
                current_time = max(current_time, event_end)
            
            # Add remaining time until end of work day
            if current_time < day_end:
                duration = (day_end - current_time).total_seconds() / 3600
                if duration >= 0.5:
                    slots.append({
                        "startTime": current_time.isoformat(),
                        "endTime": day_end.isoformat(),
                        "duration": duration
                    })
            
            current_date += timedelta(days=1)
            
        return slots

    def run(self, state: Dict[str, Any]) -> Dict[str, Any]:
        """Process fixed events and identify available time slots."""
        fixed_events = state.get("fixedEvents", [])
        preferences = state.get("preferences", {})
        
        if not fixed_events:
            state["availableSlots"] = []
            return state
            
        # Get available time slots
        available_slots = self._get_available_slots(fixed_events, preferences)
        
        # Attach processed data to state
        state["availableSlots"] = available_slots
        state["fixedEvents"] = fixed_events
        
        return state
