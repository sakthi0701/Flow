"""Enhanced local memory store with feedback tracking."""
import json
from datetime import datetime
from typing import List, Any, Dict, Optional

from feedback import TaskFeedback, FeedbackStore


class LocalMemory:
    """JSON-backed memory store with feedback tracking and relevance retrieval.

    Features:
    - persist(user_id, item, tags=None)
    - retrieve(user_id, query, limit): returns recent and keyword-matched items
    - add_feedback(user_id, feedback): stores task completion feedback
    - get_scheduling_insights(user_id): returns learned scheduling preferences
    """

    def __init__(self, path: str, feedback_path: Optional[str] = None):
        self.path = path
        self.feedback_path = feedback_path or path.replace(".json", "_feedback.json")
        
        # Initialize main memory store
        try:
            with open(self.path, "r", encoding="utf-8") as f:
                self.store = json.load(f)
        except Exception:
            self.store = {"memories": [], "user_feedback": {}}
            
        # Initialize feedback stores per user
        self.feedback_stores: Dict[str, FeedbackStore] = {}
        
        # Load existing feedback if any
        try:
            with open(self.feedback_path, "r", encoding="utf-8") as f:
                feedback_data = json.load(f)
                for user_id, user_feedback in feedback_data.items():
                    store = FeedbackStore()
                    for task_id, feedback in user_feedback.items():
                        # Convert stored dict back to TaskFeedback
                        feedback["scheduled_start"] = datetime.fromisoformat(feedback["scheduled_start"])
                        feedback["scheduled_end"] = datetime.fromisoformat(feedback["scheduled_end"])
                        if feedback.get("actual_start"):
                            feedback["actual_start"] = datetime.fromisoformat(feedback["actual_start"])
                        if feedback.get("actual_end"):
                            feedback["actual_end"] = datetime.fromisoformat(feedback["actual_end"])
                        store.add_task_feedback(TaskFeedback(**feedback))
                    self.feedback_stores[user_id] = store
        except Exception:
            pass

    def persist(self, user_id: str, item: Any, tags: list | None = None) -> None:
        """Persist an item to memory with optional tags."""
        entry = {"user_id": user_id, "item": item}
        if tags:
            entry["tags"] = tags
        self.store.setdefault("memories", []).append(entry)
        self._save_store()

    def retrieve(self, user_id: str, query: str = "", limit: int = 5) -> List[Any]:
        """Retrieve relevant items from memory."""
        # Get base candidates
        candidates = [m for m in self.store.get("memories", []) if m.get("user_id") == user_id]
        if not query:
            return [c["item"] for c in candidates][-limit:]

        # Score by query relevance
        qtokens = set(query.lower().split())
        scored = []
        for c in candidates:
            text = str(c.get("item", "")).lower()
            score = sum(1 for t in qtokens if t in text)
            scored.append((score, c))

        scored.sort(key=lambda x: x[0], reverse=True)
        results = [c[1]["item"] for c in scored if c[0] > 0]
        
        # Fallback to recent items
        if not results:
            results = [c["item"] for c in candidates][-limit:]

        return results[:limit]

    def add_feedback(self, user_id: str, feedback: TaskFeedback) -> None:
        """Add task completion feedback for a user."""
        if user_id not in self.feedback_stores:
            self.feedback_stores[user_id] = FeedbackStore()
            
        store = self.feedback_stores[user_id]
        store.add_task_feedback(feedback)
        self._save_feedback()

    def get_scheduling_insights(self, user_id: str) -> Dict[str, Any]:
        """Get learned scheduling preferences and insights for a user."""
        if user_id not in self.feedback_stores:
            return {"recommendations": [], "time_slots": {}}
            
        store = self.feedback_stores[user_id]
        return {
            "recommendations": store.generate_scheduling_recommendations(),
            "time_slots": {
                k: v.dict() for k, v in store.time_slots.items()
            }
        }

    def adjust_schedule_weights(self, user_id: str, schedule: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Apply learned weights to a proposed schedule."""
        if user_id not in self.feedback_stores:
            return schedule
            
        return self.feedback_stores[user_id].update_schedule_weights(schedule)

    def _save_store(self) -> None:
        """Save the main memory store."""
        with open(self.path, "w", encoding="utf-8") as f:
            json.dump(self.store, f, indent=2)

    def _save_feedback(self) -> None:
        """Save feedback data for all users."""
        feedback_data = {}
        for user_id, store in self.feedback_stores.items():
            feedback_data[user_id] = {
                task_id: {
                    **feedback.dict(),
                    "scheduled_start": feedback.scheduled_start.isoformat(),
                    "scheduled_end": feedback.scheduled_end.isoformat(),
                    "actual_start": feedback.actual_start.isoformat() if feedback.actual_start else None,
                    "actual_end": feedback.actual_end.isoformat() if feedback.actual_end else None
                }
                for task_id, feedback in store.task_feedback.items()
            }
            
        with open(self.feedback_path, "w", encoding="utf-8") as f:
            json.dump(feedback_data, f, indent=2)
