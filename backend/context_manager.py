"""Utilities to prepare context from memory for agents."""
import json
from typing import List


def build_context(memory, user_id: str, query: str, max_items: int = 5) -> List[str]:
    """Retrieve brief memory snippets relevant to the query.

    For the scaffold we simply return the last `max_items` entries.
    """
    try:
        items = memory.retrieve(user_id=user_id, query=query, limit=max_items)
    except Exception:
        items = []

    # convert to short strings
    return [json.dumps(i) if not isinstance(i, str) else i for i in items]
