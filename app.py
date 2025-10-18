"""Main Flask application to serve the scheduling API."""
from flask import Flask, jsonify, request
from flask_cors import CORS

from integration import get_schedule, update_task, add_goal, chat_command
from memory.local_memory import LocalMemory

# Initialize Flask app and CORS
app = Flask(__name__)
CORS(app)  # This will allow the frontend to make requests to the backend

# Initialize memory store
memory = LocalMemory("sample_data/memory.json")

@app.route("/get_schedule", methods=["POST"])
def schedule():
    """Endpoint to generate a schedule."""
    data = request.get_json()
    user_id = data.get("user_id", "default")
    query = data.get("query", "")
    if not query:
        return jsonify({"error": "Query is required"}), 400
    
    schedule_data = get_schedule(user_id, query, memory)
    return jsonify(schedule_data)

@app.route("/update_task", methods=["POST"])
def task_update():
    """Endpoint to add or update a task."""
    data = request.get_json()
    user_id = data.get("user_id", "default")
    task = data.get("task")
    if not task:
        return jsonify({"error": "Task data is required"}), 400
        
    update_task(user_id, task, memory)
    return jsonify({"status": "success"})

@app.route("/add_goal", methods=["POST"])
def goal_add():
    """Endpoint to add a goal."""
    data = request.get_json()
    user_id = data.get("user_id", "default")
    goal = data.get("goal")
    if not goal:
        return jsonify({"error": "Goal data is required"}), 400
        
    add_goal(user_id, goal, memory)
    return jsonify({"status": "success"})

@app.route("/chat_command", methods=["POST"])
def chat():
    """Endpoint for chat commands."""
    data = request.get_json()
    user_id = data.get("user_id", "default")
    command = data.get("command")
    if not command:
        return jsonify({"error": "Command is required"}), 400
        
    response = chat_command(user_id, command, memory)
    return jsonify(response)

if __name__ == "__main__":
    app.run(debug=True, port=5000)