# Life Scheduler — Copilot (Phase 1)

Minimal scaffold for the Copilot backend described in the PRD. Includes agent plumbing, local memory fallback, sample data and tests.

## Project Structure

- [agents/](agents/) - AI agent implementations (parser, constraint, allocator, coach)
- [memory/](memory/) - Local memory implementation
- [schemas/](schemas/) - JSON schemas for data validation
- [tests/](tests/) - Backend unit and integration tests
- [sample_data/](sample_data/) - Sample data files

Core files:
- [app.py](app.py) - Main Flask application with API endpoints
- [flow_ai_router.py](flow_ai_router.py) - Agent chain orchestrator
- [integration.py](integration.py) - File-based API integration layer
- [llm_client.py](llm_client.py) - LLM client interface
- [context_manager.py](context_manager.py) - Memory context manager

## Quick Start

### Poetry (recommended)
```powershell
poetry install
poetry shell
pytest -q
```

### Plain pip/venv
```powershell
python -m venv .venv; .\.venv\Scripts\Activate.ps1; pip install -r requirements-test.txt
pytest -q
```

## Usage

- To run the agent chain: see `flow_ai_router.py` (main section)
- To use file-based API: see `integration.py` and `test_integration.py`
- To test LLM prompts: see `test_llm.py`
- To test feedback/learning: see `test_feedback.py`

## Project Layout & Task List

See [PRD_TASKS.md](PRD_TASKS.md) for a full file map and completed task checklist.