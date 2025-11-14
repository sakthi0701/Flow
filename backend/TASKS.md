# Phase 1 — Copilot backend TODOs

Progress snapshot (updated automatically by the Copilot agent):

- [x] Scaffold project & init repo
  - Create project folder structure, virtualenv/venv or pyproject, and initial README. Include placeholder modules: `flow_ai_router.py`, `agents/`, `memory/`, `context_manager.py`, `tests/`.
- [ ] Define JSON schemas (in-progress)
  - Design JSON schemas for user data (fixedEvents, tasks, goals, classes, syllabusNotes, preferences) and schedule output (startTime, endTime, task, category, priority). Add sample dataset for testing.
- [ ] Implement memory module
- [ ] Implement agent interfaces
- [ ] flow_ai_router and chaining
- [ ] Core scheduling logic
- [ ] LLM prompt templates & validator
- [ ] Learning & feedback data model
- [ ] Integration endpoints (file/API)
- [ ] Unit tests & sample run
- [ ] Documentation & TODO maintenance

Relevant files added so far

- `pyproject.toml` — project metadata (poetry); dev dependency: pytest
- `README.md` — quick start and project overview
- `flow_ai_router.py` — orchestrates agent chain and memory retrieval
- `context_manager.py` — builds brief context from memory for agents
- `run_sample.py` — runnable script that executes a sample agent chain and prints output
- `sample_data/sample.json` — sample user dataset (preferences, fixedEvents, tasks)
- `sample_data/memory.json` — seeded local memory entries
- `agents/base.py` — base Agent class
- `agents/parser.py` — ParserAgent (naive intent parser)
- `agents/allocator.py` — AllocatorAgent (simple scheduling stub)
- `agents/constraint.py` — ConstraintAgent stub
- `agents/coach.py` — CoachAgent stub
- `memory/local_memory.py` — local JSON-backed memory store
- `tests/test_schedule.py` — pytest test calling the sample chain (requires pytest)

Notes

- I successfully executed `run_sample.py` with the system Python; it printed a context and an empty schedule (allocator currently requires tasks passed through the run call). See next steps for wiring.
- `pytest` isn't installed in the environment used by the runner; tests will run after installing dev dependencies (poetry or pip).

Next actions

1. Define JSON schemas and add `schemas/` or `models.py` for data shapes (I'll proceed with JSON Schema + Python dataclasses unless you prefer otherwise).
2. Implement memory adapter interface and local fallback (expand `memory/`).
3. Implement agents fully and core scheduling logic.
