from flask import Flask, request, jsonify
from flask_cors import CORS
import random
import time
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Mock data stores
conversation_history = []
agent_state = {
    "status": "idle",
    "current_goal": None,
    "subtasks": [],
    "action_log": []
}

# ============== CHATBOT API ==============
# Tuesday: Chatbot & Conversational Interfaces
# Key concepts: confidence signaling, uncertainty, correction loops

@app.route('/api/chatbot/message', methods=['POST'])
def chatbot_message():
    """
    Chatbot endpoint with confidence signaling and uncertainty
    """
    data = request.json
    user_message = data.get('message', '')
    context_id = data.get('context_id', None)

    # Simulate processing delay
    time.sleep(random.uniform(0.5, 1.5))

    # Contextual mock responses based on keywords
    msg_lower = user_message.lower()

    # Pattern matching for contextually relevant responses
    if any(word in msg_lower for word in ['ui', 'interface', 'design', 'this']):
        confidence = random.uniform(0.85, 0.95)
        response_type = "confident"
        response = "This is a learning interface for AI UX patterns, specifically demonstrating chatbot design from Tuesday's curriculum. It showcases confidence signaling, source transparency, and correction loops - key principles for building trustworthy AI interfaces."
        sources = [
            {"type": "ui_analysis", "name": "Component Structure", "relevance": 0.92},
            {"type": "design_docs", "name": "AI UX Guidelines", "relevance": 0.88}
        ]
    elif any(word in msg_lower for word in ['authentication', 'auth', 'login', 'user']):
        confidence = random.uniform(0.75, 0.90)
        response_type = "confident"
        response = "Authentication in modern web applications typically uses JWT tokens or session-based approaches. For AI systems, authentication also needs to consider context preservation across sessions and secure handling of conversation history."
        sources = [
            {"type": "documentation", "name": "Auth Best Practices", "relevance": 0.85},
            {"type": "code_search", "name": "Security Module", "relevance": 0.78}
        ]
    elif any(word in msg_lower for word in ['confidence', 'trust', 'certain']):
        confidence = random.uniform(0.80, 0.93)
        response_type = "confident"
        response = "Confidence levels in AI systems represent the model's certainty about its response. Displaying confidence helps users calibrate trust - showing high confidence (>85%) in green, medium (65-85%) in yellow, and low (<65%) in red helps users understand when to rely on or question AI outputs."
        sources = [
            {"type": "research_paper", "name": "Trust Calibration in AI UX", "relevance": 0.91},
            {"type": "ux_guidelines", "name": "PAIR Guidebook", "relevance": 0.87}
        ]
    elif any(word in msg_lower for word in ['routing', 'route', 'navigation']):
        confidence = random.uniform(0.70, 0.82)
        response_type = "uncertain"
        response = "Routing in single-page applications like Angular uses client-side navigation. I believe this involves defining routes in a configuration file, but I'm not entirely certain about the specific implementation details for standalone components."
        sources = [
            {"type": "documentation", "name": "Angular Router Guide", "relevance": 0.75},
            {"type": "code_search", "name": "Routes Configuration", "relevance": 0.68}
        ]
    elif len(user_message.strip()) < 5:
        confidence = random.uniform(0.45, 0.65)
        response_type = "low_confidence"
        response = "I'm not sure I understand. Could you provide more context or clarify your question? Short queries often lack the detail needed for accurate responses."
        sources = [
            {"type": "nlp_analysis", "name": "Query Parser", "relevance": 0.52},
            {"type": "context_analysis", "name": "Conversation History", "relevance": 0.48}
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

@app.route('/api/agent/status', methods=['GET'])
def agent_status():
    """
    Get current agent state and progress
    """
    return jsonify(agent_state)

@app.route('/api/agent/start', methods=['POST'])
def agent_start():
    """
    Start agent with a goal
    """
    data = request.json
    goal = data.get('goal', '')
    autonomy_level = data.get('autonomy_level', 'supervised')  # supervised, semi-auto, full-auto

    # Generate subtasks
    subtasks = [
        {"id": 1, "task": f"Analyze requirements for: {goal}", "status": "pending", "progress": 0},
        {"id": 2, "task": "Gather necessary resources", "status": "pending", "progress": 0},
        {"id": 3, "task": "Execute main task", "status": "pending", "progress": 0},
        {"id": 4, "task": "Verify results", "status": "pending", "progress": 0}
    ]

    agent_state.update({
        "status": "running",
        "current_goal": goal,
        "autonomy_level": autonomy_level,
        "subtasks": subtasks,
        "started_at": datetime.now().isoformat(),
        "action_log": [{
            "timestamp": datetime.now().isoformat(),
            "action": "Agent started",
            "details": f"Goal: {goal}, Autonomy: {autonomy_level}"
        }]
    })

    return jsonify(agent_state)

@app.route('/api/agent/pause', methods=['POST'])
def agent_pause():
    """
    Pause agent execution
    """
    agent_state["status"] = "paused"
    agent_state["action_log"].append({
        "timestamp": datetime.now().isoformat(),
        "action": "Agent paused by user",
        "details": "Manual intervention"
    })
    return jsonify(agent_state)

@app.route('/api/agent/resume', methods=['POST'])
def agent_resume():
    """
    Resume agent execution
    """
    agent_state["status"] = "running"
    agent_state["action_log"].append({
        "timestamp": datetime.now().isoformat(),
        "action": "Agent resumed",
        "details": "Continuing from previous state"
    })
    return jsonify(agent_state)

@app.route('/api/agent/stop', methods=['POST'])
def agent_stop():
    """
    Stop agent completely (kill switch)
    """
    agent_state.update({
        "status": "stopped",
        "current_goal": None,
        "subtasks": []
    })
    agent_state["action_log"].append({
        "timestamp": datetime.now().isoformat(),
        "action": "Agent stopped by user",
        "details": "Emergency stop"
    })
    return jsonify(agent_state)

@app.route('/api/agent/modify', methods=['POST'])
def agent_modify():
    """
    Modify agent goal or subtasks
    """
    data = request.json
    new_goal = data.get('goal', agent_state.get('current_goal'))

    agent_state["current_goal"] = new_goal
    agent_state["action_log"].append({
        "timestamp": datetime.now().isoformat(),
        "action": "Goal modified",
        "details": f"New goal: {new_goal}"
    })
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
    Get current metrics with AI insights
    """
    # Mock metrics data
    current_value = random.uniform(75, 95)
    previous_value = random.uniform(70, 90)
    change_percent = ((current_value - previous_value) / previous_value) * 100

    # AI-generated insight
    if change_percent > 5:
        insight = "Significant positive trend detected"
        recommendation = "Maintain current strategy and monitor for sustainability"
        confidence = 0.87
    elif change_percent < -5:
        insight = "Declining performance observed"
        recommendation = "Investigate root causes and consider intervention"
        confidence = 0.82
    else:
        insight = "Performance is stable"
        recommendation = "Continue monitoring, no immediate action needed"
        confidence = 0.75

    return jsonify({
        "primary_metric": {
            "name": "User Engagement Score",
            "current_value": round(current_value, 2),
            "previous_value": round(previous_value, 2),
            "change_percent": round(change_percent, 2),
            "trend": "up" if change_percent > 0 else "down",
            "unit": "points"
        },
        "ai_insight": {
            "summary": insight,
            "confidence": confidence,
            "reasoning": [
                "Historical pattern analysis shows similar trends",
                f"Current value is {abs(change_percent):.1f}% {'above' if change_percent > 0 else 'below'} previous period",
                "External factors appear minimal"
            ]
        },
        "recommendation": {
            "action": recommendation,
            "priority": "high" if abs(change_percent) > 10 else "medium" if abs(change_percent) > 5 else "low",
            "confidence": confidence
        },
        "supporting_metrics": [
            {
                "name": "Active Users",
                "value": random.randint(1000, 5000),
                "change": random.uniform(-10, 15)
            },
            {
                "name": "Session Duration",
                "value": round(random.uniform(5, 15), 1),
                "change": random.uniform(-5, 10),
                "unit": "minutes"
            },
            {
                "name": "Conversion Rate",
                "value": round(random.uniform(2, 8), 2),
                "change": random.uniform(-2, 5),
                "unit": "%"
            }
        ],
        "timestamp": datetime.now().isoformat()
    })

@app.route('/api/dmi/trend', methods=['GET'])
def dmi_trend():
    """
    Get historical trend data with confidence intervals
    """
    days = request.args.get('days', 7, type=int)

    trend_data = []
    base_value = 80
    for i in range(days):
        value = base_value + random.uniform(-5, 10)
        confidence_lower = value - random.uniform(2, 5)
        confidence_upper = value + random.uniform(2, 5)

        trend_data.append({
            "date": f"2026-02-{16-days+i:02d}",
            "value": round(value, 2),
            "confidence_interval": {
                "lower": round(confidence_lower, 2),
                "upper": round(confidence_upper, 2)
            }
        })
        base_value = value

    return jsonify({
        "trend": trend_data,
        "prediction": {
            "next_value": round(base_value + random.uniform(-3, 8), 2),
            "confidence": 0.68,
            "note": "Prediction based on 7-day moving average"
        }
    })

@app.route('/api/dmi/decision', methods=['GET'])
def dmi_decision():
    """
    Get decision-focused summary answering: What changed? Why? What next?
    """
    return jsonify({
        "what_changed": "User engagement increased by 12% over the past week",
        "why": {
            "primary_factors": [
                "New onboarding flow reduced drop-off by 8%",
                "Mobile app performance improvements",
                "Targeted email campaign showed 15% higher open rate"
            ],
            "confidence": 0.79,
            "data_quality": "high"
        },
        "what_next": {
            "immediate_actions": [
                {
                    "action": "Scale successful email campaign to broader audience",
                    "expected_impact": "5-10% additional growth",
                    "confidence": 0.72,
                    "risk": "low"
                },
                {
                    "action": "A/B test onboarding variations",
                    "expected_impact": "Further 3-5% improvement possible",
                    "confidence": 0.65,
                    "risk": "low"
                }
            ],
            "monitoring_focus": [
                "Watch for plateau in engagement after 2 weeks",
                "Monitor mobile vs desktop split for anomalies"
            ]
        },
        "timestamp": datetime.now().isoformat()
    })

# Health check
@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({"status": "healthy", "timestamp": datetime.now().isoformat()})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
