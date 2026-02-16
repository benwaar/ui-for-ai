# 1-Week Study Plan: UI for AI, Agents, Chatbots & DMI Reporting

## Learning Outcomes (by end of week)

You will be able to:
- Design UIs that **calibrate trust** in AI systems (avoid over- and under-trust)
- Create **chatbot interfaces** that support correction, uncertainty, and recovery
- Design **agent control surfaces** with visible state, goals, and safe autonomy
- Build **DMI-style dashboards** that drive decisions, not passive monitoring
- Articulate **why** your AI UI fails safely when models are wrong or data is noisy

---

## Assumed Knowledge (not covered, but relevant)
- Interaction design & component systems  
- Accessibility & responsive layout  
- Standard data visualization patterns  
- UX research & usability testing  

---

## Monday — AI UX Mental Models & Trust Calibration

**Focus:** how users *think* AI works vs how it actually works

### Key Concepts
- Overtrust vs undertrust
- Probabilistic systems in deterministic UIs
- Confidence signaling without false authority
- UI as an implicit capability contract

### Work
- Audit 2 existing AI products you know
- Identify:
  - Where the UI implies certainty
  - Where uncertainty is hidden
  - Where capability is overstated

### Output
- Short design note:  
  *“User mental model vs actual system behavior”*

---

## Tuesday — Chatbot & Conversational Interfaces

**Focus:** conversation as a control surface, not a chat novelty

### Key Concepts
- Turn-taking & interruption
- User correction loops
- Context visibility & memory
- System vs assistant voice separation

### Work
- Design a chatbot UI that supports:
  - Mid-conversation correction
  - Explicit uncertainty
  - Tool or source visibility

### Output
- Low-fi prototype
- At least 3 intentional failure states

---

## Wednesday — Agent Interfaces & Supervision

**Focus:** control, visibility, and safe autonomy

### Key Concepts
- Agent state & goal visibility
- Autonomy gradients (manual ↔ automatic)
- Action logs & explainability
- Kill switches, pause, undo

### Work
- Design an **agent control panel** with:
  - Goal definition
  - Subtask breakdown
  - Tool usage log
  - Pause / modify / stop

### Output
- Agent UI flow + control rationale

---

## Thursday — DMI & AI-Driven Reporting UX

**Focus:** dashboards that support decisions, not observation

### Key Concepts
- Decision-first metric hierarchy
- AI insights vs raw metrics
- Trend explanations
- Confidence & uncertainty visualization

### Work
- Take a dataset (real or fake)
- Identify:
  - Primary decision
  - Supporting signals
- Design a DMI dashboard answering:
  - What changed?
  - Why?
  - What should I do next?

### Output
- Dashboard sketch with:
  - AI recommendation
  - Supporting evidence
  - Confidence indicator
  - Change over time

---

## Friday — Integration, Failure & Critique

**Focus:** coherence, safety, and real-world failure

### Key Concepts
- Progressive disclosure
- Error transparency
- Human-in-the-loop design
- Ethical UX via interaction design

### Work
- Stress-test one design:
  - AI is wrong
  - Data is delayed
  - User misunderstands output

### Output
- 1-page design rationale:
  - Who it’s for
  - What decision it supports
  - How it fails safely
