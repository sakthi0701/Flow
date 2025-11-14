# PRD Task List & File Map

## Completed Tasks
- [x] Scaffold project & init repo
- [x] Define JSON schemas (user, schedule)
- [x] Implement memory module (local, vector stub)
- [x] Implement agent interfaces (Parser, Constraint, Allocator, Coach, ConflictResolver stub)
- [x] flow_ai_router and chaining
- [x] Core scheduling logic (Eisenhower, breaks, fixed events)
- [x] LLM prompt templates & validator
- [x] Learning & feedback data model
- [x] Integration endpoints (file/API)
- [x] Unit tests & sample run

## Remaining
- [ ] Documentation & TODO maintenance

## File Map & Descriptions
- `flow_ai_router.py` — Orchestrates agent chain, runs scheduling flow
- `agents/base.py` — Base Agent class
- `agents/parser.py` — LLM-based intent parser
- `agents/constraint.py` — Handles fixed events, slot finding
- `agents/allocator.py` — Eisenhower-based task allocation
- `agents/coach.py` — Feedback/encouragement agent
- `agents/conflict.py` — (Stub) Conflict resolution agent
- `memory/local_memory.py` — JSON-backed memory, feedback store
- `context_manager.py` — Context builder for agent chain
- `schemas/user_schema.json` — User data schema
- `schemas/schedule_schema.json` — Schedule output schema
- `validators.py` — LLM response validation/cleaning
- `feedback.py` — Feedback data model, learning logic
- `integration.py` — File-based API endpoints
- `tests/` — Pytest unit tests for core, feedback, integration
- `sample_data/sample.json` — Example user data
- `README.md` — Usage, setup, and project overview
