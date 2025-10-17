from .base import Agent


from llm_client import LLMClient
from prompts import ParserPromptTemplate, parse_llm_response


class ParserAgent(Agent):
    name = "parser"

    def __init__(self):
        self.llm = LLMClient()

    def run(self, state):
        query = state.get("query", "")
        context = state.get("context", [])
        
        # get LLM to parse intent and parameters
        prompt = ParserPromptTemplate.format(context=context, query=query)
        resp = self.llm.generate(prompt)
        parsed = parse_llm_response(resp["text"])
        
        # attach parsed intent or fallback
        state["parsed"] = parsed.parsed or {"intent": "general"}
        if parsed.error:
            state.setdefault("errors", []).append({"agent": self.name, "error": parsed.error})
        
        return state
