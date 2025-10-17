from .base import Agent


from llm_client import LLMClient
from prompts import CoachPromptTemplate, parse_llm_response


class CoachAgent(Agent):
    name = "coach"

    def __init__(self):
        self.llm = LLMClient()

    def run(self, state):
        schedule = state.get("schedule", [])
        context = state.get("context", [])
        
        # get LLM to generate coaching message
        prompt = CoachPromptTemplate.format(context=context, schedule=schedule)
        resp = self.llm.generate(prompt)
        parsed = parse_llm_response(resp["text"])
        
        # attach message and any concerns
        if parsed.parsed:
            state.setdefault("coach_messages", []).append(parsed.parsed.get("message", "Good luck!"))
            if "concerns" in parsed.parsed:
                state.setdefault("concerns", []).extend(parsed.parsed["concerns"])
        else:
            state.setdefault("coach_messages", []).append(f"Planned {len(schedule)} tasks. Good luck!")
            if parsed.error:
                state.setdefault("errors", []).append({"agent": self.name, "error": parsed.error})
        
        return state
