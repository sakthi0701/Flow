"""Data models for the Life Scheduler application."""
from datetime import datetime
from typing import Optional, Dict, Any
from pydantic import BaseModel, Field
from pydantic import ConfigDict


class UserPreferences(BaseModel):
    """User scheduling preferences."""
    work_day_start: str = Field(default="09:00", description="Start of work day (HH:MM)")
    work_day_end: str = Field(default="17:00", description="End of work day (HH:MM)")
    break_duration: int = Field(default=15, description="Break duration in minutes")
    min_work_block: int = Field(default=45, description="Minimum work block in minutes")
    preferred_study_time: Optional[str] = Field(default=None, description="Preferred study time (HH:MM-HH:MM)")
    preferred_work_time: Optional[str] = Field(default=None, description="Preferred work time (HH:MM-HH:MM)")
    # Add more preferences as needed


class User(BaseModel):
    """User model for authentication and preferences."""
    id: str = Field(..., description="Unique user identifier")
    email: str = Field(..., description="User email address")
    name: str = Field(..., description="User's full name")
    password_hash: str = Field(..., description="Hashed password")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    last_login: Optional[datetime] = None
    preferences: UserPreferences = Field(default_factory=lambda: UserPreferences())
    is_active: bool = Field(default=True)
    is_verified: bool = Field(default=False)