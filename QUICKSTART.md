# Quick Start Guide

## Running the Project

### Option 1: Single Command (Recommended)

Run both servers with one command:

```bash
./start.sh
```

This will start both backend and frontend. Press `Ctrl+C` to stop both.

**Alternative startup methods:**
- `./start-tmux.sh` - Runs in tmux with split panes (requires tmux)
- `./start-separate.sh` - Opens separate Terminal windows (macOS only)

### Option 2: Manual Start

#### 1. Start the Backend (Terminal 1)

```bash
cd backend
source venv/bin/activate
python app.py
```

Backend will run on `http://localhost:5000`

### 2. Start the Frontend (Terminal 2)

```bash
cd frontend
npm install    # Only needed first time
npm start
```

Frontend will run on `http://localhost:4200`

### 3. Open in Browser

Navigate to `http://localhost:4200`

You'll see the chatbot interface demonstrating Tuesday's learning concepts.

## What You'll See

### Chatbot Interface (Tuesday)

The interface demonstrates key AI UX patterns:

1. **Confidence Signaling**
   - Green badges = High confidence (85%+)
   - Yellow badges = Uncertain (65-85%)
   - Red badges = Low confidence (<65%)

2. **Source Transparency**
   - Every response shows what sources the AI consulted
   - Relevance bars indicate how much each source influenced the answer

3. **Correction Loops**
   - Click "✏️ Correct this" on any message
   - Fix misunderstandings without restarting the conversation

4. **Uncertainty Display**
   - When confidence is low, AI suggests alternative interpretations
   - No false certainty - always shows doubt visually

5. **Failure States**
   - Network errors display clearly
   - Low confidence triggers warning UI
   - Alternative suggestions when uncertain

## Try These Prompts

- "What is authentication?" - Should return high confidence
- "How does routing work?" - May return medium confidence
- Any random text - Will return low confidence with alternatives

## API Endpoints Available

See [backend/README.md](backend/README.md) for full API documentation.

- **POST** `/api/chatbot/message` - Send a message
- **POST** `/api/chatbot/correct` - Correct a response
- **GET** `/api/chatbot/history` - View conversation history

## Coming Soon

- **Wednesday**: Agent control panel with state visibility
- **Thursday**: DMI dashboard with decision-focused metrics
- **Friday**: Integration and failure testing

## Troubleshooting

**Backend won't start?**
- Make sure you're in the venv: `source venv/bin/activate`
- Check Python version: `python --version` (should be 3.11.x)

**Frontend won't start?**
- Make sure Node is v20: `node --version`
- Run `npm install` in the frontend directory

**CORS errors?**
- Make sure backend is running on port 5000
- Flask-CORS is configured to allow all origins in development
