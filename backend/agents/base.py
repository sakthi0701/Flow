from typing import Dict, Any


class Agent:
    """Base Agent interface. Agents accept and return a state dict."""

    name = "base"

    def run(self, state: Dict[str, Any]) -> Dict[str, Any]:
        raise NotImplementedError
