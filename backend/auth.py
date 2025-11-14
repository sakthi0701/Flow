"""Authentication service for the Life Scheduler application."""
import hashlib
import secrets
from datetime import datetime, timezone
from typing import Optional, Dict, Any
from models import User, UserPreferences
from memory.local_memory import LocalMemory


class AuthService:
    """Service for user authentication and management."""
    
    def __init__(self, memory: LocalMemory):
        self.memory = memory
        
    def _hash_password(self, password: str, salt: str) -> str:
        """Hash a password with a salt."""
        return hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt.encode('utf-8'), 100000).hex()
        
    def _serialize_user(self, user: User) -> Dict[str, Any]:
        """Serialize user to dictionary with datetime strings."""
        user_dict = user.model_dump()
        # Convert datetime objects to ISO format strings
        if user_dict.get('created_at'):
            user_dict['created_at'] = user_dict['created_at'].isoformat()
        if user_dict.get('last_login'):
            user_dict['last_login'] = user_dict['last_login'].isoformat() if user_dict['last_login'] else None
        return user_dict
        
    def _deserialize_user(self, user_dict: Dict[str, Any]) -> User:
        """Deserialize user dictionary to User object."""
        # Convert datetime strings back to datetime objects
        if user_dict.get('created_at') and isinstance(user_dict['created_at'], str):
            user_dict['created_at'] = datetime.fromisoformat(user_dict['created_at'])
        if user_dict.get('last_login') and isinstance(user_dict['last_login'], str):
            user_dict['last_login'] = datetime.fromisoformat(user_dict['last_login'])
        return User(**user_dict)
        
    def register_user(self, email: str, name: str, password: str) -> User:
        """Register a new user."""
        # Check if user already exists
        existing_users = self.memory.retrieve("system", f"user_email:{email}")
        if existing_users:
            raise ValueError("User with this email already exists")
            
        # Create salt and hash password
        salt = secrets.token_hex(16)
        password_hash = self._hash_password(password, salt)
        
        # Create user
        user = User(
            id=secrets.token_hex(8),
            email=email,
            name=name,
            password_hash=f"{salt}:{password_hash}",
            preferences=UserPreferences()
        )
        
        # Save user to memory
        self.memory.persist("system", {
            "type": "user",
            "user_id": user.id,
            "email": user.email,
            "data": self._serialize_user(user)
        }, tags=[f"user_email:{email}", f"user_id:{user.id}"])
        
        return user
        
    def authenticate_user(self, email: str, password: str) -> Optional[User]:
        """Authenticate a user with email and password."""
        # Retrieve user by email
        users = self.memory.retrieve("system", f"user_email:{email}")
        if not users:
            return None
            
        user_data = users[0]
        if not isinstance(user_data, dict) or user_data.get("type") != "user":
            return None
            
        user_dict = user_data.get("data", {})
        user = self._deserialize_user(user_dict)
        
        # Verify password
        salt, stored_hash = user.password_hash.split(':')
        password_hash = self._hash_password(password, salt)
        
        if password_hash == stored_hash:
            # Update last login
            user.last_login = datetime.now(timezone.utc)
            user_dict_updated = self._serialize_user(user)
            self.memory.persist("system", {
                "type": "user",
                "user_id": user.id,
                "email": user.email,
                "data": user_dict_updated
            }, tags=[f"user_email:{email}", f"user_id:{user.id}"])
            return user
            
        return None
        
    def get_user(self, user_id: str) -> Optional[User]:
        """Get a user by ID."""
        users = self.memory.retrieve("system", f"user_id:{user_id}")
        if not users:
            return None
            
        user_data = users[0]
        if not isinstance(user_data, dict) or user_data.get("type") != "user":
            return None
            
        user_dict = user_data.get("data", {})
        return self._deserialize_user(user_dict)
        
    def update_user_preferences(self, user_id: str, preferences: Dict[str, Any]) -> bool:
        """Update user preferences."""
        user = self.get_user(user_id)
        if not user:
            return False
            
        # Update preferences
        print(f"Before update: {user.preferences}")
        user.preferences = UserPreferences(**{**user.preferences.model_dump(), **preferences})
        print(f"After update: {user.preferences}")
        
        # Save updated user
        self.memory.persist("system", {
            "type": "user",
            "user_id": user.id,
            "email": user.email,
            "data": self._serialize_user(user)
        }, tags=[f"user_email:{user.email}", f"user_id:{user.id}"])
        
        return True