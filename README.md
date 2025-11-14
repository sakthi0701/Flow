# Life Scheduler - Copilot (Phase 1)

This project is organized into two main parts:

## Backend (`backend/`)
Contains the Python-based AI scheduling backend with:
- AI agent system for parsing, constraining, allocating, and coaching
- Local memory implementation for context persistence
- REST API endpoints for frontend integration
- Tests and sample data

## Frontend (`frontend/`)
Contains the React Native mobile application with:
- Expo-based mobile interface
- Screens for home, dashboard, planner, coach, focus, and settings
- Components for calendar, chat, timer, and more
- API service integration with the backend

## Getting Started

### Backend
Navigate to the [backend/](backend/) directory and follow the instructions in [README.md](backend/README.md).

### Frontend
Navigate to the [frontend/](frontend/) directory and follow the instructions in [README.md](frontend/README.md) (if available) or use standard Expo commands.

## Development Workflow
1. Start the backend server
2. Start the frontend development server
3. Connect the frontend to the backend via API calls