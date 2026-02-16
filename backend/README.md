# Backend Mock API for AI UX Learning

Flask-based mock API server providing endpoints for experimenting with AI UI patterns.

## Setup

```bash
# Activate virtual environment
source venv/bin/activate

# Install dependencies (already done during setup)
pip install -r requirements.txt

# Run the server
python app.py
```

Server runs on `http://localhost:5000`

## API Endpoints

### Chatbot API (Tuesday: Conversational Interfaces)

**POST /api/chatbot/message**
- Send a message to the chatbot
- Returns response with confidence level, sources, and correction support
- Body: `{ "message": "your message", "context_id": "optional" }`

**POST /api/chatbot/correct**
- Correct the chatbot's understanding mid-conversation
- Body: `{ "correction": "corrected text", "context_id": "ctx_id" }`

**GET /api/chatbot/history**
- Get conversation history (last 10 messages)

### Agent Control API (Wednesday: Agent Supervision)

**GET /api/agent/status**
- Get current agent state, goal, and subtasks

**POST /api/agent/start**
- Start agent with a goal
- Body: `{ "goal": "task description", "autonomy_level": "supervised|semi-auto|full-auto" }`

**POST /api/agent/pause**
- Pause agent execution

**POST /api/agent/resume**
- Resume paused agent

**POST /api/agent/stop**
- Emergency stop (kill switch)

**POST /api/agent/modify**
- Modify agent's current goal
- Body: `{ "goal": "new goal description" }`

**GET /api/agent/action-log**
- Get detailed action log for explainability

### DMI Dashboard API (Thursday: Decision-Driven Metrics)

**GET /api/dmi/metrics**
- Get current metrics with AI insights and recommendations
- Returns primary metric, confidence levels, and supporting data

**GET /api/dmi/trend?days=7**
- Get historical trend data with confidence intervals
- Query param: `days` (default: 7)

**GET /api/dmi/decision**
- Get decision-focused summary answering:
  - What changed?
  - Why did it change?
  - What should I do next?

### Health Check

**GET /api/health**
- Server health status

## Key Features Demonstrated

### Chatbot API
- **Confidence signaling**: Every response includes confidence score (0-1)
- **Uncertainty display**: Different response types based on confidence
- **Source transparency**: Shows which sources/tools were used
- **Correction loops**: Users can correct mid-conversation
- **Alternative interpretations**: Suggests alternatives when uncertain

### Agent API
- **State visibility**: Clear agent status (idle, running, paused, stopped)
- **Goal tracking**: Current goal and subtask breakdown
- **Autonomy levels**: supervised, semi-auto, full-auto
- **Action logs**: Complete history of agent actions for explainability
- **Control surface**: pause, resume, stop, modify capabilities

### DMI Dashboard API
- **Decision-first metrics**: Focused on actionable insights
- **AI reasoning**: Shows why the AI came to its conclusion
- **Confidence visualization**: Every insight has confidence level
- **Trend analysis**: Historical data with confidence intervals
- **Actionable recommendations**: What to do next with expected impact

## Development Notes

All endpoints include simulated delays and randomization to mimic real AI behavior. Confidence levels, trends, and insights are procedurally generated for prototyping purposes.
