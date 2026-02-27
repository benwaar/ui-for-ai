from flask import Flask, request, jsonify
from flask_cors import CORS
import random
import time
from datetime import datetime
import threading

app = Flask(__name__)
CORS(app)

# Mock data stores
conversation_history = []
agent_state = {
    "status": "idle",
    "current_goal": None,
    "subtasks": [],
    "action_log": [],
    "last_update": None
}
agent_lock = threading.Lock()
agent_thread = None

# ============== CHATBOT API ==============
# Tuesday: Chatbot & Conversational Interfaces
# Key concepts: confidence signaling, uncertainty, correction loops

@app.route('/api/chatbot/message', methods=['POST'])
def chatbot_message():
    """
    Chatbot endpoint with confidence signaling, uncertainty, and tool execution
    """
    data = request.json
    user_message = data.get('message', '')
    context_id = data.get('context_id', None)

    # Simulate processing delay
    time.sleep(random.uniform(0.5, 1.5))

    # Contextual mock responses based on keywords
    msg_lower = user_message.lower()

    # Initialize tools used (simulating tool execution)
    tools_used = []

    # Pattern matching for contextually relevant responses
    if any(word in msg_lower for word in ['ui', 'interface', 'design', 'this']):
        confidence = random.uniform(0.85, 0.95)
        response_type = "confident"
        response = "This is a learning interface for AI UX patterns, specifically demonstrating chatbot design from Tuesday's curriculum. It showcases confidence signaling, source transparency, and correction loops - key principles for building trustworthy AI interfaces."
        sources = [
            {"type": "ui_analysis", "name": "Component Structure", "relevance": 0.92},
            {"type": "design_docs", "name": "AI UX Guidelines", "relevance": 0.88}
        ]
        tools_used = [
            {"name": "CodeAnalyzer", "description": "Analyzed UI component structure", "execution_time_ms": 245, "success": True},
            {"name": "DocumentSearch", "description": "Searched design documentation", "execution_time_ms": 189, "success": True}
        ]
    elif any(word in msg_lower for word in ['authentication', 'auth', 'login', 'user']):
        confidence = random.uniform(0.75, 0.90)
        response_type = "confident"
        response = "Authentication in modern web applications typically uses JWT tokens or session-based approaches. For AI systems, authentication also needs to consider context preservation across sessions and secure handling of conversation history."
        sources = [
            {"type": "documentation", "name": "Auth Best Practices", "relevance": 0.85},
            {"type": "code_search", "name": "Security Module", "relevance": 0.78}
        ]
        tools_used = [
            {"name": "DocumentationSearcher", "description": "Searched security best practices", "execution_time_ms": 312, "success": True},
            {"name": "CodebaseGrep", "description": "Found authentication implementations", "execution_time_ms": 428, "success": True},
            {"name": "VulnerabilityScanner", "description": "Checked for security issues", "execution_time_ms": 156, "success": True}
        ]
    elif any(word in msg_lower for word in ['confidence', 'trust', 'certain']):
        confidence = random.uniform(0.80, 0.93)
        response_type = "confident"
        response = "Confidence levels in AI systems represent the model's certainty about its response. Displaying confidence helps users calibrate trust - showing high confidence (>85%) in green, medium (65-85%) in yellow, and low (<65%) in red helps users understand when to rely on or question AI outputs."
        sources = [
            {"type": "research_paper", "name": "Trust Calibration in AI UX", "relevance": 0.91},
            {"type": "ux_guidelines", "name": "PAIR Guidebook", "relevance": 0.87}
        ]
        tools_used = [
            {"name": "ResearchPaperSearch", "description": "Found relevant HCI research", "execution_time_ms": 567, "success": True},
            {"name": "GuidelineParser", "description": "Extracted UX best practices", "execution_time_ms": 203, "success": True}
        ]
    elif any(word in msg_lower for word in ['routing', 'route', 'navigation']):
        confidence = random.uniform(0.70, 0.82)
        response_type = "uncertain"
        response = "Routing in single-page applications like Angular uses client-side navigation. I believe this involves defining routes in a configuration file, but I'm not entirely certain about the specific implementation details for standalone components."
        sources = [
            {"type": "documentation", "name": "Angular Router Guide", "relevance": 0.75},
            {"type": "code_search", "name": "Routes Configuration", "relevance": 0.68}
        ]
        tools_used = [
            {"name": "DocumentationSearcher", "description": "Searched Angular docs", "execution_time_ms": 412, "success": True},
            {"name": "CodebaseGrep", "description": "Searched for route definitions", "execution_time_ms": 289, "success": False},
            {"name": "SemanticAnalyzer", "description": "Analyzed routing patterns", "execution_time_ms": 334, "success": True}
        ]
    elif any(word in msg_lower for word in ['agent', 'autonomous', 'supervision', 'wednesday']):
        confidence = random.uniform(0.86, 0.94)
        response_type = "confident"
        response = "Agent interfaces demonstrate how to design control surfaces for autonomous AI systems. Key patterns include: state visibility (showing what the agent is doing), autonomy gradients (supervised/semi-auto/full-auto), action logs for explainability, and safe control mechanisms (pause/resume/stop). Navigate to the 'Wednesday: Agent' section to explore these patterns interactively."
        sources = [
            {"type": "design_patterns", "name": "Agent Supervision UX", "relevance": 0.91},
            {"type": "ui_examples", "name": "Control Panel Patterns", "relevance": 0.88},
            {"type": "research", "name": "Human-Agent Interaction", "relevance": 0.84}
        ]
        tools_used = [
            {"name": "ProjectScanner", "description": "Located agent component implementation", "execution_time_ms": 198, "success": True},
            {"name": "GuidelineParser", "description": "Extracted supervision best practices", "execution_time_ms": 234, "success": True}
        ]
    elif any(word in msg_lower for word in ['subtask', 'progress', 'task breakdown']):
        confidence = random.uniform(0.82, 0.92)
        response_type = "confident"
        response = "Subtask breakdown is a key visibility pattern in agent UIs. It shows users the agent's plan decomposed into smaller steps, with individual progress bars and status indicators (pending/in-progress/completed/failed). This helps users understand what the agent is doing and builds appropriate trust through transparency."
        sources = [
            {"type": "ui_patterns", "name": "Progress Visualization", "relevance": 0.89},
            {"type": "design_docs", "name": "Agent State Display", "relevance": 0.85}
        ]
        tools_used = [
            {"name": "DocumentationSearcher", "description": "Found progress pattern guidelines", "execution_time_ms": 276, "success": True},
            {"name": "CodeAnalyzer", "description": "Analyzed subtask component", "execution_time_ms": 193, "success": True}
        ]
    elif any(word in msg_lower for word in ['action log', 'explainability', 'transparency']):
        confidence = random.uniform(0.84, 0.93)
        response_type = "confident"
        response = "Action logs provide explainability for agent decisions. Each timestamped entry shows what action the agent took and why, creating an audit trail users can review. This transparency builds trust and helps debug issues. Best practice: show last 10 actions by default with 'Show All' option for full history."
        sources = [
            {"type": "research", "name": "Explainable AI Principles", "relevance": 0.92},
            {"type": "ui_patterns", "name": "Audit Trail Display", "relevance": 0.87}
        ]
        tools_used = [
            {"name": "ResearchPaperSearch", "description": "Found XAI literature", "execution_time_ms": 445, "success": True},
            {"name": "GuidelineParser", "description": "Extracted logging best practices", "execution_time_ms": 212, "success": True}
        ]
    elif any(word in msg_lower for word in ['autonomy', 'supervised', 'semi-auto', 'full-auto']):
        confidence = random.uniform(0.87, 0.95)
        response_type = "confident"
        response = "Autonomy gradients give users control over how much independence an agent has. Supervised mode requires approval for each action (safest), semi-auto allows pausing (balanced), and full-auto runs independently (fastest). Different tasks need different autonomy levels - use supervised for critical operations, full-auto for routine tasks."
        sources = [
            {"type": "research", "name": "Human-AI Collaboration Models", "relevance": 0.91},
            {"type": "design_patterns", "name": "Autonomy Control UX", "relevance": 0.88}
        ]
        tools_used = [
            {"name": "ResearchPaperSearch", "description": "Found autonomy research", "execution_time_ms": 389, "success": True},
            {"name": "DependencyAnalyzer", "description": "Analyzed control patterns", "execution_time_ms": 167, "success": True}
        ]
    elif any(word in msg_lower for word in ['component', 'angular']) and 'ui' not in msg_lower:
        confidence = random.uniform(0.88, 0.95)
        response_type = "confident"
        response = "Angular components are the building blocks of Angular applications. Each component consists of a TypeScript class with a @Component decorator, an HTML template, and optional CSS styles. Modern Angular supports standalone components that don't require NgModules."
        sources = [
            {"type": "documentation", "name": "Angular Component Guide", "relevance": 0.93},
            {"type": "code_examples", "name": "Component Patterns", "relevance": 0.87}
        ]
        tools_used = [
            {"name": "DocumentationSearcher", "description": "Searched Angular component docs", "execution_time_ms": 287, "success": True},
            {"name": "CodeAnalyzer", "description": "Analyzed component structure", "execution_time_ms": 356, "success": True},
            {"name": "PatternMatcher", "description": "Found component patterns", "execution_time_ms": 198, "success": True}
        ]
    elif any(word in msg_lower for word in ['codebase', 'entire', 'explain all']):
        confidence = random.uniform(0.82, 0.91)
        response_type = "confident"
        response = "This codebase implements a learning lab for AI UX patterns. It consists of an Angular frontend (TypeScript/HTML/SCSS) and a Flask backend (Python). The project demonstrates chatbot interfaces, agent supervision, and decision-making interfaces with features like confidence signaling, context visibility, and graceful failure handling."
        sources = [
            {"type": "codebase_scan", "name": "Project Structure", "relevance": 0.89},
            {"type": "documentation", "name": "README and Design Docs", "relevance": 0.84}
        ]
        tools_used = [
            {"name": "ProjectScanner", "description": "Analyzed project structure", "execution_time_ms": 542, "success": True},
            {"name": "DependencyAnalyzer", "description": "Mapped dependencies", "execution_time_ms": 423, "success": True},
            {"name": "DocumentationParser", "description": "Extracted design patterns", "execution_time_ms": 312, "success": True}
        ]
    elif any(word in msg_lower for word in ['best practice', 'practices']):
        confidence = random.uniform(0.85, 0.94)
        response_type = "confident"
        response = "Best practices for AI interfaces include: showing confidence levels, providing source transparency, enabling user corrections, maintaining context visibility, separating system and assistant voices, handling failures gracefully, and never claiming false authority. These principles help build trust and usability."
        sources = [
            {"type": "research", "name": "AI UX Best Practices", "relevance": 0.91},
            {"type": "guidelines", "name": "PAIR Guidebook", "relevance": 0.88}
        ]
        tools_used = [
            {"name": "ResearchDatabase", "description": "Searched UX research papers", "execution_time_ms": 467, "success": True},
            {"name": "GuidelineParser", "description": "Extracted design guidelines", "execution_time_ms": 234, "success": True}
        ]
    elif len(user_message.strip()) < 5:
        confidence = random.uniform(0.45, 0.65)
        response_type = "low_confidence"
        response = "I'm not sure I understand. Could you provide more context or clarify your question? Short queries often lack the detail needed for accurate responses."
        sources = [
            {"type": "nlp_analysis", "name": "Query Parser", "relevance": 0.52},
            {"type": "context_analysis", "name": "Conversation History", "relevance": 0.48}
        ]
        tools_used = [
            {"name": "QueryParser", "description": "Analyzed query structure", "execution_time_ms": 89, "success": True},
            {"name": "ContextRetriever", "description": "Retrieved conversation context", "execution_time_ms": 123, "success": False}
        ]
    else:
        # Generic response with random confidence
        confidence = random.uniform(0.5, 0.95)
        if confidence > 0.85:
            response_type = "confident"
            response = f"Based on my analysis, {user_message.lower()} is well-documented in our knowledge base. The implementation follows standard best practices for modern web applications."
        elif confidence > 0.65:
            response_type = "uncertain"
            response = f"I have some information about {user_message.lower()}, but I'm not entirely certain about all the details. It might be related to the core functionality, though additional verification would be helpful."
        else:
            response_type = "low_confidence"
            response = f"I'm not confident about {user_message.lower()}. Would you like me to search the documentation or connect you with a human expert?"

        sources = [
            {"type": "documentation", "name": "API Guide", "relevance": confidence},
            {"type": "code_search", "name": "Repository Scan", "relevance": confidence * 0.8}
        ]

        # Add realistic tool execution data
        tools_used = [
            {"name": "KnowledgeBaseSearch", "description": "Searched documentation", "execution_time_ms": random.randint(150, 400), "success": True},
            {"name": "CodeAnalyzer", "description": "Analyzed codebase patterns", "execution_time_ms": random.randint(200, 500), "success": confidence > 0.6},
            {"name": "SemanticParser", "description": "Parsed query intent", "execution_time_ms": random.randint(100, 250), "success": True}
        ]

    # Generate contextual alternative interpretations for low confidence
    alternatives = []
    if confidence < 0.7:
        if 'ui' in msg_lower or 'interface' in msg_lower:
            alternatives = [
                "Did you mean 'What is this interface for?'",
                "Or were you asking 'How does this UI work?'"
            ]
        elif 'auth' in msg_lower or 'login' in msg_lower:
            alternatives = [
                "Did you mean 'authentication flow?'",
                "Or were you asking about 'user login process?'"
            ]
        elif len(user_message.strip()) < 5:
            alternatives = [
                "Could you rephrase with more detail?",
                "Did you want to know about a specific feature?"
            ]
        else:
            alternatives = [
                f"Did you mean '{user_message} implementation?'",
                f"Or were you asking about '{user_message} best practices?'"
            ]

    response_data = {
        "message": response,
        "confidence": round(confidence, 2),
        "response_type": response_type,
        "sources": sources,
        "tools_used": tools_used,  # Add tools execution data
        "timestamp": datetime.now().isoformat(),
        "context_id": context_id or f"ctx_{int(time.time())}",
        "can_correct": True,  # Allow mid-conversation correction
        "alternative_interpretations": alternatives
    }

    conversation_history.append({
        "user": user_message,
        "assistant": response_data,
        "timestamp": datetime.now().isoformat()
    })

    return jsonify(response_data)

@app.route('/api/chatbot/correct', methods=['POST'])
def chatbot_correct():
    """
    Allow user to correct chatbot's understanding mid-conversation
    """
    data = request.json
    correction = data.get('correction', '')
    context_id = data.get('context_id', '')

    return jsonify({
        "acknowledged": True,
        "message": f"Thanks for the correction. I now understand you meant: {correction}",
        "updated_confidence": 0.95,
        "context_id": context_id
    })

@app.route('/api/chatbot/history', methods=['GET'])
def chatbot_history():
    """
    Get conversation history (context visibility)
    """
    return jsonify({
        "history": conversation_history[-10:],  # Last 10 messages
        "total_messages": len(conversation_history)
    })

# ============== AGENT CONTROL API ==============
# Wednesday: Agent Interfaces & Supervision
# Key concepts: state visibility, autonomy control, action logs

def simulate_agent_work():
    """
    Background thread that simulates agent making progress
    Updates subtasks and adds action log entries over time
    """
    global agent_state

    action_examples = [
        ("Scanning codebase structure", "Located 47 files across 12 directories"),
        ("Analyzing dependencies", "Found 23 npm packages and 8 dev dependencies"),
        ("Running security scan", "Checked for 156 known vulnerabilities"),
        ("Reviewing code patterns", "Identified 3 potential improvements"),
        ("Gathering documentation", "Retrieved API specs and README files"),
        ("Consulting best practices", "Cross-referenced with industry standards"),
        ("Generating summary", "Compiled findings into structured report"),
        ("Validating results", "Performed quality check on outputs"),
        ("Organizing deliverables", "Structured final documentation"),
        ("Preparing recommendations", "Listed actionable next steps"),
    ]

    step_counter = 0

    while True:
        time.sleep(2)  # Update every 2 seconds

        with agent_lock:
            if agent_state["status"] != "running":
                break

            # Update subtasks progressively
            updated = False
            for subtask in agent_state["subtasks"]:
                if subtask["status"] == "pending":
                    # Start the first pending task
                    subtask["status"] = "in_progress"
                    subtask["progress"] = 10
                    agent_state["action_log"].append({
                        "timestamp": datetime.now().isoformat(),
                        "action": f"Starting task: {subtask['task']}",
                        "details": "Initializing resources and gathering context"
                    })
                    updated = True
                    break
                elif subtask["status"] == "in_progress":
                    # Progress the in-progress task
                    if subtask["progress"] < 100:
                        subtask["progress"] = min(100, subtask["progress"] + random.randint(10, 25))

                        # Add random action log entry
                        if step_counter % 2 == 0 and step_counter < len(action_examples):
                            action, details = action_examples[step_counter // 2]
                            agent_state["action_log"].append({
                                "timestamp": datetime.now().isoformat(),
                                "action": action,
                                "details": details
                            })

                        updated = True

                    if subtask["progress"] >= 100:
                        # Complete this task
                        subtask["status"] = "completed"
                        subtask["progress"] = 100
                        agent_state["action_log"].append({
                            "timestamp": datetime.now().isoformat(),
                            "action": f"Task completed: {subtask['task']}",
                            "details": "All requirements met, moving to next task"
                        })
                        updated = True
                    break

            step_counter += 1

            # Check if all tasks are completed
            if all(t["status"] == "completed" for t in agent_state["subtasks"]):
                agent_state["status"] = "stopped"
                agent_state["action_log"].append({
                    "timestamp": datetime.now().isoformat(),
                    "action": "All tasks completed successfully",
                    "details": f"Goal achieved: {agent_state['current_goal']}"
                })
                break

            if updated:
                agent_state["last_update"] = datetime.now().isoformat()

@app.route('/api/agent/status', methods=['GET'])
def agent_status():
    """
    Get current agent state and progress
    """
    return jsonify(agent_state)

@app.route('/api/agent/start', methods=['POST'])
def agent_start():
    """
    Start agent with a goal and background simulation
    """
    global agent_thread

    data = request.json
    goal = data.get('goal', '')
    autonomy_level = data.get('autonomy_level', 'supervised')  # supervised, semi-auto, full-auto

    # Generate subtasks based on goal keywords
    goal_lower = goal.lower()
    if any(word in goal_lower for word in ['security', 'vulnerability', 'audit']):
        subtasks = [
            {"id": 1, "task": f"Analyze security requirements for: {goal}", "status": "pending", "progress": 0},
            {"id": 2, "task": "Run security vulnerability scan", "status": "pending", "progress": 0},
            {"id": 3, "task": "Review authentication and authorization", "status": "pending", "progress": 0},
            {"id": 4, "task": "Generate security report with recommendations", "status": "pending", "progress": 0}
        ]
    elif any(word in goal_lower for word in ['document', 'documentation', 'spec']):
        subtasks = [
            {"id": 1, "task": f"Analyze scope for: {goal}", "status": "pending", "progress": 0},
            {"id": 2, "task": "Gather code structure and API definitions", "status": "pending", "progress": 0},
            {"id": 3, "task": "Generate documentation content", "status": "pending", "progress": 0},
            {"id": 4, "task": "Format and validate documentation", "status": "pending", "progress": 0}
        ]
    elif any(word in goal_lower for word in ['analyze', 'review', 'check']):
        subtasks = [
            {"id": 1, "task": f"Define analysis criteria for: {goal}", "status": "pending", "progress": 0},
            {"id": 2, "task": "Collect and organize data", "status": "pending", "progress": 0},
            {"id": 3, "task": "Perform detailed analysis", "status": "pending", "progress": 0},
            {"id": 4, "task": "Summarize findings and recommendations", "status": "pending", "progress": 0}
        ]
    else:
        subtasks = [
            {"id": 1, "task": f"Understand requirements for: {goal}", "status": "pending", "progress": 0},
            {"id": 2, "task": "Gather necessary resources and context", "status": "pending", "progress": 0},
            {"id": 3, "task": "Execute primary task", "status": "pending", "progress": 0},
            {"id": 4, "task": "Verify and validate results", "status": "pending", "progress": 0}
        ]

    with agent_lock:
        agent_state.update({
            "status": "running",
            "current_goal": goal,
            "autonomy_level": autonomy_level,
            "subtasks": subtasks,
            "started_at": datetime.now().isoformat(),
            "last_update": datetime.now().isoformat(),
            "action_log": [{
                "timestamp": datetime.now().isoformat(),
                "action": "Agent started",
                "details": f"Goal: {goal}, Autonomy: {autonomy_level}"
            }]
        })

    # Start background thread to simulate agent work
    agent_thread = threading.Thread(target=simulate_agent_work, daemon=True)
    agent_thread.start()

    return jsonify(agent_state)

@app.route('/api/agent/pause', methods=['POST'])
def agent_pause():
    """
    Pause agent execution (stops background thread)
    """
    with agent_lock:
        agent_state["status"] = "paused"
        agent_state["action_log"].append({
            "timestamp": datetime.now().isoformat(),
            "action": "Agent paused by user",
            "details": "Manual intervention - execution suspended"
        })
        agent_state["last_update"] = datetime.now().isoformat()
    return jsonify(agent_state)

@app.route('/api/agent/resume', methods=['POST'])
def agent_resume():
    """
    Resume agent execution (restarts background thread)
    """
    global agent_thread

    with agent_lock:
        agent_state["status"] = "running"
        agent_state["action_log"].append({
            "timestamp": datetime.now().isoformat(),
            "action": "Agent resumed",
            "details": "Continuing from previous state"
        })
        agent_state["last_update"] = datetime.now().isoformat()

    # Restart background thread
    agent_thread = threading.Thread(target=simulate_agent_work, daemon=True)
    agent_thread.start()

    return jsonify(agent_state)

@app.route('/api/agent/stop', methods=['POST'])
def agent_stop():
    """
    Stop agent completely (kill switch)
    """
    with agent_lock:
        agent_state["action_log"].append({
            "timestamp": datetime.now().isoformat(),
            "action": "Agent stopped by user",
            "details": "Emergency stop - all processes terminated"
        })
        agent_state.update({
            "status": "stopped",
            "current_goal": None,
            "subtasks": [],
            "last_update": datetime.now().isoformat()
        })
    return jsonify(agent_state)

@app.route('/api/agent/modify', methods=['POST'])
def agent_modify():
    """
    Modify agent goal mid-execution
    """
    data = request.json
    new_goal = data.get('goal', agent_state.get('current_goal'))
    old_goal = agent_state.get('current_goal')

    with agent_lock:
        agent_state["current_goal"] = new_goal
        agent_state["action_log"].append({
            "timestamp": datetime.now().isoformat(),
            "action": "Goal modified by user",
            "details": f"Previous: '{old_goal}' → New: '{new_goal}'"
        })
        agent_state["last_update"] = datetime.now().isoformat()

    return jsonify(agent_state)

@app.route('/api/agent/action-log', methods=['GET'])
def agent_action_log():
    """
    Get detailed action log for explainability
    """
    return jsonify({
        "actions": agent_state.get("action_log", []),
        "total_actions": len(agent_state.get("action_log", []))
    })

# ============== DMI DASHBOARD API ==============
# Thursday: DMI & AI-Driven Reporting UX
# Key concepts: decision-first metrics, AI insights, confidence visualization

@app.route('/api/dmi/metrics', methods=['GET'])
def dmi_metrics():
    """
    Get software project health metrics with status indicators
    """
    # Software Project Health Metrics
    metrics = [
        {
            "name": "Build Time",
            "key": "build_time",
            "current": round(random.uniform(2.5, 5.5), 2),
            "previous": round(random.uniform(3.0, 5.0), 2),
            "unit": "min",
            "direction": "lower_is_better"
        },
        {
            "name": "Test Pass Rate",
            "key": "test_pass_rate",
            "current": round(random.uniform(85, 98), 1),
            "previous": round(random.uniform(80, 95), 1),
            "unit": "%",
            "direction": "higher_is_better"
        },
        {
            "name": "Deployment Frequency",
            "key": "deployment_frequency",
            "current": random.randint(15, 35),
            "previous": random.randint(12, 30),
            "unit": "per week",
            "direction": "higher_is_better"
        },
        {
            "name": "Code Coverage",
            "key": "code_coverage",
            "current": round(random.uniform(70, 85), 1),
            "previous": round(random.uniform(65, 80), 1),
            "unit": "%",
            "direction": "higher_is_better"
        },
        {
            "name": "Open Bugs",
            "key": "bug_count",
            "current": random.randint(5, 25),
            "previous": random.randint(8, 28),
            "unit": "count",
            "direction": "lower_is_better"
        }
    ]

    # Calculate change and status for each metric
    for metric in metrics:
        current = metric["current"]
        previous = metric["previous"]
        change_percent = ((current - previous) / previous) * 100
        metric["change_percent"] = round(change_percent, 1)

        # Determine trend direction
        if change_percent > 1:
            metric["trend"] = "up"
        elif change_percent < -1:
            metric["trend"] = "down"
        else:
            metric["trend"] = "stable"

        # Determine status based on direction preference and change
        is_improving = (metric["direction"] == "higher_is_better" and change_percent > 0) or \
                      (metric["direction"] == "lower_is_better" and change_percent < 0)

        if metric["key"] == "test_pass_rate":
            if current >= 95:
                metric["status"] = "healthy"
            elif current >= 85:
                metric["status"] = "warning"
            else:
                metric["status"] = "critical"
        elif metric["key"] == "build_time":
            if current <= 3.5:
                metric["status"] = "healthy"
            elif current <= 5.0:
                metric["status"] = "warning"
            else:
                metric["status"] = "critical"
        elif metric["key"] == "bug_count":
            if current <= 10:
                metric["status"] = "healthy"
            elif current <= 20:
                metric["status"] = "warning"
            else:
                metric["status"] = "critical"
        else:
            # Generic status based on improvement
            if is_improving and abs(change_percent) > 5:
                metric["status"] = "healthy"
            elif not is_improving and abs(change_percent) > 10:
                metric["status"] = "critical"
            else:
                metric["status"] = "warning"

    return jsonify({
        "metrics": metrics,
        "timestamp": datetime.now().isoformat()
    })

@app.route('/api/dmi/trend', methods=['GET'])
def dmi_trend():
    """
    Get historical trend data for a specific metric
    """
    metric = request.args.get('metric', 'test_pass_rate', type=str)
    days = request.args.get('days', 14, type=int)

    # Define baseline values and ranges for different metrics
    metric_configs = {
        "build_time": {"base": 4.0, "variance": 0.8, "unit": "min"},
        "test_pass_rate": {"base": 90, "variance": 5, "unit": "%"},
        "deployment_frequency": {"base": 20, "variance": 8, "unit": "per week"},
        "code_coverage": {"base": 75, "variance": 5, "unit": "%"},
        "bug_count": {"base": 15, "variance": 6, "unit": "count"}
    }

    config = metric_configs.get(metric, metric_configs["test_pass_rate"])
    trend_data = []
    base_value = config["base"]

    for i in range(days):
        # Add realistic variance with some trend
        value = base_value + random.uniform(-config["variance"]/2, config["variance"]/2)

        # Simulate occasional anomalies
        is_anomaly = random.random() < 0.1  # 10% chance
        if is_anomaly:
            value += random.uniform(-config["variance"], config["variance"])

        trend_data.append({
            "date": f"2026-02-{14+i:02d}" if i < 14 else f"2026-02-{i-13:02d}",
            "value": round(value, 2),
            "is_anomaly": is_anomaly
        })

        # Drift base value slightly for realistic trends
        base_value = value * 0.7 + base_value * 0.3

    return jsonify({
        "metric": metric,
        "unit": config["unit"],
        "trend": trend_data,
        "timestamp": datetime.now().isoformat()
    })

@app.route('/api/dmi/decision', methods=['GET'])
def dmi_decision():
    """
    Get AI-driven deployment decision with reasoning
    """
    # Simulate metrics for decision making
    test_pass_rate = random.uniform(85, 98)
    build_time = random.uniform(2.5, 5.5)
    bug_count = random.randint(5, 25)
    code_coverage = random.uniform(70, 85)

    # Decision logic
    critical_issues = []
    warnings = []
    confidence_factors = []

    if test_pass_rate < 90:
        critical_issues.append(f"Test pass rate at {test_pass_rate:.1f}% (below 90% threshold)")
    else:
        confidence_factors.append(f"Strong test pass rate ({test_pass_rate:.1f}%)")

    if bug_count > 15:
        warnings.append(f"{bug_count} open bugs (above recommended 15)")
    else:
        confidence_factors.append(f"Low bug count ({bug_count})")

    if build_time > 5.0:
        warnings.append(f"Build time elevated at {build_time:.1f} min")
    elif build_time < 3.5:
        confidence_factors.append(f"Fast build time ({build_time:.1f} min)")

    if code_coverage < 75:
        warnings.append(f"Code coverage at {code_coverage:.1f}% (below 75% target)")
    else:
        confidence_factors.append(f"Adequate code coverage ({code_coverage:.1f}%)")

    # Determine recommendation
    if critical_issues:
        recommendation = "hold"
        reasoning = "Critical quality metrics below acceptable thresholds"
        urgency = "immediate"
        confidence = 0.85
    elif len(warnings) >= 2:
        recommendation = "investigate"
        reasoning = "Multiple warning signals detected - review before deploying"
        urgency = "within_hours"
        confidence = 0.78
    elif len(warnings) == 1:
        recommendation = "deploy"
        reasoning = "Overall health is good with minor concerns"
        urgency = "within_days"
        confidence = 0.82
    else:
        recommendation = "deploy"
        reasoning = "All metrics within healthy ranges"
        urgency = "immediate"
        confidence = 0.92

    # What changed analysis
    change_summary = []
    if test_pass_rate > 95:
        change_summary.append("Test suite stability improved")
    if bug_count < 10:
        change_summary.append("Bug resolution rate increased")
    if build_time < 4.0:
        change_summary.append("Build performance optimized")

    if not change_summary:
        change_summary.append("Metrics remain stable with no significant changes")

    # Impact assessment
    if recommendation == "deploy":
        impact = {
            "risk_level": "low" if confidence > 0.85 else "medium",
            "expected_outcome": "Smooth deployment with minimal user impact",
            "rollback_plan": "Automated rollback available within 5 minutes"
        }
    elif recommendation == "investigate":
        impact = {
            "risk_level": "medium",
            "expected_outcome": "Investigation will identify root causes within 2-4 hours",
            "next_steps": "Review logs, run diagnostics, consult with team leads"
        }
    else:  # hold
        impact = {
            "risk_level": "high",
            "expected_outcome": "Deployment blocked pending quality improvements",
            "required_actions": "Address critical issues before reconsidering deployment"
        }

    return jsonify({
        "recommendation": recommendation,  # deploy, hold, investigate, rollback
        "confidence": confidence,
        "reasoning": reasoning,
        "urgency": urgency,  # immediate, within_hours, within_days, next_sprint
        "what_changed": "; ".join(change_summary) if change_summary else "No significant changes",
        "why": {
            "critical_issues": critical_issues,
            "warnings": warnings,
            "confidence_factors": confidence_factors
        },
        "impact": impact,
        "supporting_factors": [
            {"metric": "Test Pass Rate", "value": f"{test_pass_rate:.1f}%", "status": "healthy" if test_pass_rate >= 90 else "warning"},
            {"metric": "Open Bugs", "value": bug_count, "status": "healthy" if bug_count <= 15 else "warning"},
            {"metric": "Build Time", "value": f"{build_time:.1f} min", "status": "healthy" if build_time <= 5.0 else "warning"},
            {"metric": "Code Coverage", "value": f"{code_coverage:.1f}%", "status": "healthy" if code_coverage >= 75 else "warning"}
        ],
        "timestamp": datetime.now().isoformat()
    })

@app.route('/api/dmi/decision-log', methods=['GET'])
def dmi_decision_log():
    """
    Get historical decision log with outcomes
    """
    # Mock historical decisions
    decisions = [
        {
            "timestamp": "2026-02-26T14:30:00",
            "recommendation": "deploy",
            "confidence": 0.89,
            "actual_outcome": "success",
            "outcome_details": "Deployment completed successfully. No incidents reported.",
            "metrics_snapshot": {
                "test_pass_rate": 94.5,
                "build_time": 3.2,
                "bug_count": 8
            }
        },
        {
            "timestamp": "2026-02-25T09:15:00",
            "recommendation": "investigate",
            "confidence": 0.76,
            "actual_outcome": "correct",
            "outcome_details": "Investigation revealed memory leak. Fixed before deploying.",
            "metrics_snapshot": {
                "test_pass_rate": 89.2,
                "build_time": 5.1,
                "bug_count": 14
            }
        },
        {
            "timestamp": "2026-02-23T16:45:00",
            "recommendation": "deploy",
            "confidence": 0.92,
            "actual_outcome": "success",
            "outcome_details": "Smooth deployment. Performance metrics improved.",
            "metrics_snapshot": {
                "test_pass_rate": 96.8,
                "build_time": 2.9,
                "bug_count": 6
            }
        },
        {
            "timestamp": "2026-02-22T11:20:00",
            "recommendation": "hold",
            "confidence": 0.85,
            "actual_outcome": "correct",
            "outcome_details": "Critical test failures prevented bad deployment.",
            "metrics_snapshot": {
                "test_pass_rate": 82.1,
                "build_time": 4.5,
                "bug_count": 22
            }
        },
        {
            "timestamp": "2026-02-20T13:00:00",
            "recommendation": "deploy",
            "confidence": 0.87,
            "actual_outcome": "partial",
            "outcome_details": "Deployment succeeded but minor UI issues found post-release.",
            "metrics_snapshot": {
                "test_pass_rate": 93.4,
                "build_time": 3.8,
                "bug_count": 11
            }
        }
    ]

    # Calculate decision accuracy
    total = len(decisions)
    correct = sum(1 for d in decisions if d["actual_outcome"] in ["success", "correct"])
    accuracy = (correct / total) * 100 if total > 0 else 0

    return jsonify({
        "decisions": decisions,
        "summary": {
            "total_decisions": total,
            "correct_decisions": correct,
            "accuracy": round(accuracy, 1),
            "avg_confidence": round(sum(d["confidence"] for d in decisions) / total, 2) if total > 0 else 0
        },
        "timestamp": datetime.now().isoformat()
    })

# Health check
@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({"status": "healthy", "timestamp": datetime.now().isoformat()})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
