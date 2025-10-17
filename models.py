from dataclasses import dataclass
from typing import List, Optional


@dataclass
class BreakRatio:
    work_minutes: int
    break_minutes: int


@dataclass
class Preferences:
    break_ratio: BreakRatio
    preferred_study_time: Optional[str] = None


@dataclass
class FixedEvent:
    id: str
    title: str
    start: str
    end: str


@dataclass
class Task:
    id: str
    title: str
    estimated_minutes: int
    priority: Optional[str] = None
    category: Optional[str] = None


@dataclass
class UserData:
    user_id: str
    preferences: Preferences
    fixedEvents: List[FixedEvent]
    tasks: List[Task]
