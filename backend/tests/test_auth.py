"""Unit tests for authentication service."""
import tempfile
import os
from auth import AuthService
from memory.local_memory import LocalMemory
from models import UserPreferences


def test_user_registration_and_authentication():
    """Test user registration and authentication."""
    # Create a temporary memory file for testing
    with tempfile.NamedTemporaryFile(mode='w', suffix='.json', delete=False) as f:
        temp_memory_path = f.name
        f.write('{"memories": [], "user_feedback": {}}')
    
    try:
        memory = LocalMemory(temp_memory_path)
        auth_service = AuthService(memory)
        
        # Register a new user
        user = auth_service.register_user("test@example.com", "Test User", "password123")
        print(f"Registered user: {user}")
        assert user.email == "test@example.com"
        assert user.name == "Test User"
        assert user.id is not None
        assert user.preferences is not None
        
        # Try to register the same user again (should fail)
        try:
            auth_service.register_user("test@example.com", "Another User", "password456")
            assert False, "Should have raised ValueError"
        except ValueError:
            pass  # Expected
            
        # Authenticate with correct password
        authenticated_user = auth_service.authenticate_user("test@example.com", "password123")
        print(f"Authenticated user: {authenticated_user}")
        assert authenticated_user is not None
        assert authenticated_user.email == "test@example.com"
        assert authenticated_user.last_login is not None
        
        # Authenticate with incorrect password
        authenticated_user = auth_service.authenticate_user("test@example.com", "wrongpassword")
        print(f"Wrong password user: {authenticated_user}")
        assert authenticated_user is None
        
        # Authenticate with non-existent user
        authenticated_user = auth_service.authenticate_user("nonexistent@example.com", "password123")
        print(f"Non-existent user: {authenticated_user}")
        assert authenticated_user is None
        
    finally:
        # Clean up the temporary file
        os.unlink(temp_memory_path)


def test_user_preferences():
    """Test user preferences management."""
    # Create a temporary memory file for testing
    with tempfile.NamedTemporaryFile(mode='w', suffix='.json', delete=False) as f:
        temp_memory_path = f.name
        f.write('{"memories": [], "user_feedback": {}}')
    
    try:
        memory = LocalMemory(temp_memory_path)
        auth_service = AuthService(memory)
        
        # Register a new user
        user = auth_service.register_user("pref@example.com", "Preference User", "password123")
        print(f"Registered user: {user}")
        print(f"User ID: {user.id}")
        
        # Update user preferences
        new_preferences = {
            "work_day_start": "08:00",
            "work_day_end": "18:00",
            "break_duration": 30
        }
        success = auth_service.update_user_preferences(user.id, new_preferences)
        print(f"Update success: {success}")
        assert success is True
        
        # Get updated user and verify preferences
        updated_user = auth_service.get_user(user.id)
        print(f"Updated user: {updated_user}")
        assert updated_user is not None
        assert updated_user.preferences.work_day_start == "08:00"
        assert updated_user.preferences.work_day_end == "18:00"
        assert updated_user.preferences.break_duration == 30
        
    finally:
        # Clean up the temporary file
        os.unlink(temp_memory_path)