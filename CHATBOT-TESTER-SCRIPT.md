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

## Notes for Testing

- The chatbot uses simulated responses for demonstration
- Some failure states trigger based on specific keywords or message count
- All features are functional in the UI even without a live backend
- This is a low-fidelity prototype focusing on UX patterns, not production-ready code