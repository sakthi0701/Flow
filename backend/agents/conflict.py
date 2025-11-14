from .base import Agent

class ConflictResolverAgent(Agent):
    name = "conflict_resolver"

    def run(self, state):
        # Stub: In a future phase, resolve schedule conflicts
        state.setdefault("conflicts", [])
        return state
