## Testing the UI

# Tuesday - Chatbot & Conversational Interfaces

## Overview
This test script demonstrates the key concepts from the Tuesday exercise:
- Turn-taking & interruption
- User correction loops
- Context visibility & memory
- System vs assistant voice separation
- Explicit uncertainty handling
- Tool/source visibility
- Multiple intentional failure states

---

## Test Scenarios

### 1. Basic Conversation with Confidence Signaling
**Goal:** See standard AI responses with confidence indicators

**Steps:**
1. Type: `"What are confidence levels?"`
2. Press Send
3. Observe the response

**Expected Results:**
- AI Assistant (🤖) responds with an answer about confidence levels in AI systems
- Confidence badge shows (e.g., "High Confidence 92%")
- Message has colored left border indicating confidence level:
  - Green = High confidence (85%+)
  - Yellow = Medium/Uncertain (65-85%)
  - Red = Low confidence (<65%)
- Timestamp displayed
- Sources section may appear showing what documents were consulted

---

### 2. Source & Tool Transparency
**Goal:** Verify users can see what sources and tools the AI used

**Steps:**
1. Type: `"What is this UI for?"`
2. Press Send and observe the response
3. Look for the "Sources consulted:" section below the response
4. Look for the "🔧 Tools Used:" section showing which tools were executed

**Expected Results:**
- Sources section shows:
  - Source name (e.g., "Component Structure", "AI UX Guidelines")
  - Source type (ui_analysis, design_docs, etc.)
  - Relevance bar (visual indicator of how relevant each source was)
- Tools section shows:
  - Tool name (e.g., "CodeAnalyzer", "DocumentSearch")
  - Tool description
  - Execution time in milliseconds
  - Success/failure indicator (✓ or ✗)

---

### 3. Context Visibility Panel
**Goal:** See the conversation context/memory the AI maintains

**Steps:**
1. Click the "🔼 Show Context" button at the top
2. Send a few messages like:
   - `"How does routing work?"`
   - `"Tell me about Angular components"`
   - `"What are best practices?"`
3. Watch the context panel update with each message

**Expected Results:**
- Context panel slides down showing:
  - Session start time
  - Recent user queries
  - AI response types
  - Confidence levels
  - Timestamps for each context item
- Last 10 items displayed
- Context updates in real-time with each new message
- Click "🔽 Hide Context" to collapse the panel

---

### 4. Mid-Conversation Correction
**Goal:** Correct an AI misunderstanding without restarting

**Steps:**
1. Type: `"What is authentication?"` and send
2. Once you get a response, click the "✏️ Correct this" button below the AI response
3. In the correction input, type: `"I meant authorization, not authentication"`
4. Press "Submit Correction" or hit Enter

**Expected Results:**
- Correction input appears inline
- AI acknowledges the correction
- Conversation continues with corrected understanding
- Context is maintained (no restart needed)

---

### 5. Interruption Control
**Goal:** Stop a long-running AI response

**Steps:**
1. Type: `"Explain the entire codebase in detail"` and press Send
2. While "Loading..." is showing, click the "⏹️ Interrupt" button
3. Observe the result

**Expected Results:**
- Loading stops immediately
- System message (🔧 System) appears: "⚠️ Response interrupted by user"
- Input field becomes active again
- You can send a new message

---

### 6. Failure State: Timeout
**Goal:** See how the system handles slow/timed-out requests

**Steps:**
1. Type: `"Tell me something slow"`
2. Press Send
3. Wait 3 seconds

**Expected Results:**
- System message (🔧 System) appears: "⏱️ Request timed out"
- Failure state section shows:
  - Type: timeout
  - Details: "Request exceeded maximum processing time"
  - Suggested Action: "Try rephrasing or simplifying your question"
  - 🔄 Retry button available

---

### 7. Failure State: Ambiguous Query
**Goal:** See how AI handles unclear references

**Steps:**
1. Type: `"How does that work?"`
2. Press Send

**Expected Results:**
- System message (🔧 System) indicates ambiguity
- Failure state section explains the issue
- Alternative interpretations shown:
  - "Are you asking about the authentication system?"
  - "Are you referring to the routing configuration?"
  - "Do you mean the previous topic we discussed?"
- Suggested action to be more specific

---

### 8. Failure State: Context Loss
**Goal:** See what happens when conversation context is lost

**Steps:**
1. Send 9+ messages to build up context
2. One of your later messages may trigger context loss
3. Observe the system recovery

**Expected Results:**
- System message (🔧 System): "🔄 Context lost. Starting a new conversation thread."
- Failure state explains what happened
- Context panel resets to initial state
- User can continue with fresh context

---

### 9. Failure State: Rate Limiting
**Goal:** See rate limiting protection

**Steps:**
1. Send 11 messages rapidly (or keep conversation going)
2. After the 10th message, next one triggers rate limit

**Expected Results:**
- System message (🔧 System): "⚠️ Rate limit exceeded"
- Failure state section shows:
  - Type: rate_limited
  - Message: "Too many requests in a short time"
  - Suggested Action: "Wait 30 seconds before retrying"
  - Retry button available

---

### 10. Failure State: Network Error
**Goal:** See how network failures are handled

**Steps:**
1. Stop the backend API server (if running)
2. Send any message
3. Observe error handling

**Expected Results:**
- System message (🔧 System): "❌ Network error: Unable to connect"
- Failure state section provides:
  - Type: network_error
  - Clear error message
  - Suggested action: "Check your internet connection and try again"
  - Retry option

---

### 11. Voice Separation Verification
**Goal:** Confirm clear distinction between message types

**Steps:**
1. Send several different types of messages:
   - Regular query: `"What is Angular?"`
   - Then interrupt the next response to trigger a system message
   - Then send: `"How does that work?"` to trigger an ambiguous query
2. Observe the visual differences between message types

**Expected Results:**
Three distinct message types are clearly differentiated:

**User Messages:**
- Aligned right
- Blue background (#007bff)
- Label: "You"

**AI Assistant Messages (🤖):**
- Aligned left
- White/light background with colored border
- Label: "🤖 AI Assistant"
- Shows confidence badge
- Shows sources and tools

**System Messages (🔧):**
- Aligned left
- Yellow/orange background (#fff9e6)
- Orange border
- Label: "🔧 System"
- Used for errors, warnings, interruptions, context changes

---

### 12. Uncertain Response with Alternatives
**Goal:** See how AI expresses uncertainty

**Steps:**
1. Type: `"xyz"` (a very short, unclear query)
2. Press Send
3. Observe the low-confidence response

**Expected Results:**
- Low confidence badge (red, <65%)
- Red left border on message
- "⚠️ I'm not certain. Did you mean:" section appears
- Multiple alternative interpretations listed:
  - "Could you rephrase with more detail?"
  - "Did you want to know about a specific feature?"
- User can clarify based on alternatives

---

## Key UX Patterns Demonstrated

1. **Turn-taking & Interruption**
   - Natural conversation flow
   - Ability to interrupt long responses
   - Clear loading states

2. **User Correction Loops**
   - Inline correction without losing context
   - Acknowledgment of corrections
   - Maintained conversation history

3. **Context Visibility & Memory**
   - Toggleable context panel
   - Real-time context updates
   - Last 10 context items tracked

4. **System vs Assistant Voice**
   - 🤖 AI Assistant: Normal responses
   - 🔧 System: Errors, warnings, state changes
   - Visual and semantic separation

5. **Explicit Uncertainty**
   - Confidence percentages
   - Visual color coding
   - Alternative interpretations when uncertain
   - No false authority

6. **Tool/Source Visibility**
   - Sources consulted for each answer
   - Tools executed with timing
   - Success/failure indicators
   - Relevance scoring

7. **Graceful Failure States** (5 types)
   - Timeout
   - Rate limiting
   - Ambiguous queries
   - Context loss
   - Network errors
   - Each provides clear guidance and recovery options

---

## Design Principles Validated

✅ **No False Authority** - Always show confidence, never pretend certainty
✅ **Transparency** - Users see sources, tools, and reasoning
✅ **User Control** - Interrupt, correct, and guide the conversation
✅ **Clear Communication** - Separate system, assistant, and user voices
✅ **Graceful Degradation** - Every failure provides guidance
✅ **Context Awareness** - Users can inspect what AI remembers
✅ **Honest Uncertainty** - AI admits when it's not sure

---

# Wednesday - Agent Interfaces & Supervision

## Overview
This test script demonstrates the key concepts from the Wednesday exercise:
- Agent state & goal visibility
- Autonomy gradients (manual ↔ automatic)
- Action logs & explainability
- Kill switches, pause, undo
- Subtask breakdown visibility
- Safe control of autonomous systems

---

## Test Scenarios

### 13. Basic Agent Start with Supervised Mode
**Goal:** Start an agent with a goal and observe initial state

**Steps:**
1. Navigate to http://localhost:4200/agent (or click "Wednesday: Agent" in navigation)
2. In the "Agent Goal" field, type: `"Analyze security requirements for the authentication system"`
3. Keep autonomy level at "Supervised" (default)
4. Click "Start"

**Expected Results:**
- Status chip changes from "IDLE" (gray) to "RUNNING" (green)
- Status updates every 2 seconds automatically
- "Subtask Breakdown" panel appears showing 4 subtasks:
  - Task 1: "Analyze requirements for: [your goal]" - status: in_progress, progress bar starts
  - Task 2: "Gather necessary resources" - status: pending
  - Task 3: "Execute main task" - status: pending
  - Task 4: "Verify results" - status: pending
- "Action Log" panel appears with first entry: "Agent started"
- Goal input field and autonomy selector become disabled
- Pause, Resume buttons become enabled

---

### 14. Autonomy Level Selection
**Goal:** Understand different autonomy modes

**Steps:**
1. Before starting an agent, try each autonomy level:
   - Click "Supervised" - Note the icon (visibility icon)
   - Click "Semi-Auto" - Note the icon (auto_mode)
   - Click "Full-Auto" - Note the icon (rocket_launch)
2. Read the intro card explanation of each mode

**Expected Results:**
- **Supervised Mode** (Blue chip):
  - Agent asks for approval before each action
  - Maximum human oversight
  - Safest option for critical tasks

- **Semi-Auto Mode** (Purple chip):
  - Agent proceeds but can be paused
  - Balanced autonomy with control
  - Good for routine tasks with review

- **Full-Auto Mode** (Red chip):
  - Agent runs independently until completion
  - Minimal human intervention
  - Fast but requires trust

---

### 15. Subtask Progress Monitoring
**Goal:** Watch agent make progress through tasks

**Steps:**
1. Start an agent with any goal (e.g., "Generate technical documentation")
2. Expand the "Subtask Breakdown" panel if collapsed
3. Watch the progress bars update every 2 seconds
4. Observe status changes: pending → in_progress → completed

**Expected Results:**
- Progress bars fill from 0% to 100%
- Status icons change:
  - Pending: Empty circle (radio_button_unchecked)
  - In Progress: Spinning circle (pending) - Purple color
  - Completed: Check circle (check_circle) - Blue color
  - Failed: Error icon (error) - Red color
- Completion counter in header updates: "Subtasks (1/4 completed)" → "(2/4)" → etc.
- Completed tasks show 100% progress
- Each subtask has a status chip showing current state

---

### 16. Action Log for Explainability
**Goal:** See what the agent is doing and why

**Steps:**
1. Start an agent with any goal
2. Expand the "Action Log" panel
3. Watch entries appear in real-time (every 2 seconds)
4. Scroll through actions to see the agent's decision trail

**Expected Results:**
- Action log shows timestamped entries:
  - "Agent started" - Goal and autonomy level
  - "Starting task: Analyze requirements..." - Details
  - "Resource retrieved: [name]" - What was accessed
  - "Decision made: [choice]" - Reasoning
  - "Task completed: [task]" - Outcome
- Timestamps show date and time (e.g., "2/27/26, 5:45 PM")
- By default, last 10 actions shown
- "Show All" button appears if more than 10 actions
- Click "Show All" to see complete history
- Click "Show Less" to collapse back to 10

---

### 17. Pause and Resume Control
**Goal:** Safely pause agent execution

**Steps:**
1. Start an agent with a goal
2. Wait for 1-2 subtasks to show progress
3. Click "Pause" button
4. Wait 5 seconds
5. Click "Resume" button

**Expected Results:**
After clicking Pause:
- Status chip changes to "PAUSED" (orange)
- Status polling stops (no more automatic updates)
- Action log shows: "Agent paused by user - Manual intervention"
- Resume button becomes enabled
- Pause button becomes disabled
- Subtask progress freezes at current values

After clicking Resume:
- Status chip changes back to "RUNNING" (green)
- Status polling restarts (updates every 2 seconds)
- Action log shows: "Agent resumed - Continuing from previous state"
- Subtasks continue progressing from where they stopped
- Pause button becomes enabled again

---

### 18. Goal Modification Mid-Execution
**Goal:** Change agent's goal without restarting

**Steps:**
1. Start an agent with goal: `"Analyze API endpoints"`
2. Wait for 1-2 subtasks to start
3. Click the edit icon (✏️) next to "Current Goal:"
4. In the modification form, type: `"Analyze API endpoints and generate OpenAPI spec"`
5. Click "Submit"

**Expected Results:**
- Inline modification form appears with pre-filled current goal
- After submission:
  - Current goal updates immediately
  - Action log shows: "Goal modified - New goal: [updated text]"
  - Agent continues with new goal
  - Subtasks may adjust to new goal
  - No restart needed, context preserved

---

### 19. Emergency Stop (Kill Switch)
**Goal:** Immediately terminate agent execution

**Steps:**
1. Start an agent with any goal
2. Wait for agent to be actively running (2-3 subtasks in progress)
3. Click the red "Stop" button

**Expected Results:**
- Status chip changes to "STOPPED" (red)
- Status polling stops immediately
- All subtasks disappear
- Current goal cleared
- Action log shows: "Agent stopped by user - Emergency stop"
- Goal input field becomes enabled again
- All subtasks reset to initial state
- User can enter new goal and start fresh

---

### 20. Status Polling and Real-Time Updates
**Goal:** Verify automatic status updates

**Steps:**
1. Start an agent
2. Don't interact - just watch
3. Observe updates happening automatically every 2 seconds
4. Note the timestamps in action log

**Expected Results:**
- Without any user interaction, you see:
  - Subtask progress bars filling gradually
  - Subtask statuses changing (pending → in_progress → completed)
  - New action log entries appearing
  - Completion counter updating
  - Timestamps advancing every 2 seconds
- This demonstrates polling mechanism (GET /api/agent/status every 2 seconds)
- Polling only active when status is "running"
- Polling stops when paused or stopped

---

### 21. Theme Integration
**Goal:** Verify agent UI works in both themes

**Steps:**
1. On the agent page, click the theme toggle (top-right)
2. Switch between Colorful and Dark themes
3. Observe color changes for all status indicators

**Expected Results:**
**Colorful Theme:**
- Status colors: Idle (gray #757575), Running (green #4caf50), Paused (orange #ff9800), Stopped (red #f44336)
- Autonomy colors: Supervised (blue #1976d2), Semi-Auto (purple #7b1fa2), Full-Auto (red #d32f2f)
- Light card backgrounds, dark text
- High contrast for accessibility

**Dark Theme:**
- Status colors: Brighter versions (gray #9e9e9e, green #66bb6a, orange #ffa726, red #ef5350)
- Autonomy colors: Brighter (blue #42a5f5, purple #ab47bc, red #ef5350)
- Dark card backgrounds, light text
- Maintained contrast ratios

---

### 22. Multiple Agent Sessions
**Goal:** Test starting, stopping, and restarting

**Steps:**
1. Start agent with goal: `"Task A"`
2. Let it run for 10 seconds
3. Click "Stop"
4. Start new agent with goal: `"Task B"`
5. Observe clean state transition

**Expected Results:**
- First agent stops cleanly:
  - All state cleared
  - No orphaned subtasks
  - Action log preserved until new start
- Second agent starts fresh:
  - New goal displayed
  - New subtasks generated (4 fresh tasks)
  - Action log resets with new "Agent started"
  - No contamination from previous session
  - Status polling begins again

---

### 23. Empty State
**Goal:** Verify helpful guidance when no agent active

**Steps:**
1. Navigate to /agent without starting any agent
2. Observe the empty state card

**Expected Results:**
- Large agent icon (smart_toy) displayed
- Heading: "No Active Agent"
- Instructions: "Enter a goal and select an autonomy level to start the agent."
- Helpful hint box with light bulb icon:
  - "Try: 'Analyze the codebase for security vulnerabilities'"
  - "Or: 'Generate a technical requirements document'"
- Professional, encouraging tone
- Clear call-to-action

---

### 24. Accessibility Verification
**Goal:** Test keyboard navigation and screen reader compatibility

**Steps:**
1. On agent page, press Tab repeatedly
2. Navigate through all interactive elements
3. Press Enter/Space to activate buttons
4. Verify ARIA labels (inspect with browser DevTools)

**Expected Results:**
- Tab order is logical:
  - Theme toggle
  - Goal input field
  - Autonomy level toggles (Tab through all 3)
  - Start button
  - Pause/Resume/Stop buttons (when enabled)
  - Modify goal button (when visible)
  - Expansion panel headers (subtasks, action log)
- All buttons respond to Enter/Space
- Focus indicators visible (blue outline)
- ARIA attributes present:
  - `aria-label` on icon-only buttons
  - `role="progressbar"` on progress bars
  - `aria-valuenow`, `aria-valuemin`, `aria-valuemax` on progress bars
  - `aria-labelledby` on autonomy toggle group
- Color + icon + text encoding ensures info conveyed through multiple channels

---

## Key UX Patterns Demonstrated

1. **Agent State Visibility**
   - Current status always visible (idle/running/paused/stopped)
   - Real-time progress monitoring
   - Subtask breakdown with individual status tracking

2. **Autonomy Gradients**
   - Three distinct autonomy levels
   - Visual differentiation (color + icon + text)
   - Clear explanation of each mode

3. **Action Logs & Explainability**
   - Complete audit trail of agent decisions
   - Timestamped actions with details
   - "Show All" for full history transparency

4. **Safe Control Mechanisms**
   - Pause: Temporary hold, resumable
   - Stop: Emergency termination
   - Modify: Mid-flight goal changes
   - All reversible except stop

5. **Real-Time Updates**
   - Automatic status polling (2 seconds)
   - Progressive subtask completion
   - Growing action log
   - No manual refresh needed

6. **Goal Management**
   - Clear goal visibility
   - Inline modification without restart
   - Goal locked during execution (disabled input)

7. **Visual Feedback**
   - Color-coded status (green/orange/red/gray)
   - Icon encoding (play/pause/stop/circle)
   - Progress bars (0-100%)
   - Triple encoding for accessibility

---

## Design Principles Validated

✅ **State Visibility** - Agent's current state always clear
✅ **User Control** - Pause, resume, stop, modify at will
✅ **Explainability** - Action log shows reasoning trail
✅ **Safe Autonomy** - Multiple levels with appropriate safeguards
✅ **Real-Time Awareness** - Automatic updates without polling burden
✅ **Graceful Degradation** - Clean state transitions, no orphaned processes
✅ **Accessibility** - Triple encoding, keyboard nav, ARIA support

---

## Notes for Testing

- The chatbot uses simulated responses for demonstration
- Some failure states trigger based on specific keywords or message count
- All features are functional in the UI even without a live backend
- This is a low-fidelity prototype focusing on UX patterns, not production-ready code
- **New:** Agent backend simulates realistic progression with timed updates
- Agent subtasks and action logs populate automatically to demonstrate real-world behavior