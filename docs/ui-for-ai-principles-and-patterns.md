# UI for AI: Principles & Patterns

## Table of Contents
- [UI for AI: Principles \& Patterns](#ui-for-ai-principles--patterns)
  - [Table of Contents](#table-of-contents)
  - [Introduction: Why AI Changes Everything](#introduction-why-ai-changes-everything)
  - [User Mental Models: Deterministic vs Probabilistic Systems](#user-mental-models-deterministic-vs-probabilistic-systems)
  - [Trust Calibration: Overtrust \& Undertrust](#trust-calibration-overtrust--undertrust)
  - [Confidence Signaling Without False Authority](#confidence-signaling-without-false-authority)
  - [Progressive Disclosure \& Transparency](#progressive-disclosure--transparency)
  - [Conversation as a UI Paradigm](#conversation-as-a-ui-paradigm)
  - [Conversational Design Fundamentals](#conversational-design-fundamentals)
  - [Core Chat Interface Patterns](#core-chat-interface-patterns)
  - [Message Display \& Interaction Patterns](#message-display--interaction-patterns)
  - [Streaming \& Real‑Time Feedback](#streaming--realtime-feedback)
  - [Context \& Memory Management](#context--memory-management)
  - [Decision-Making Intelligence (DMI) \& AI-Driven Reporting](#decision-making-intelligence-dmi--ai-driven-reporting)
  - [Agent Safety \& Governance](#agent-safety--governance)
  - [Privacy \& Accessibility](#privacy--accessibility)
  - [Graceful Failure \& Recovery](#graceful-failure--recovery)
  - [Short, High-Value Videos](#short-high-value-videos)
  - [Useful links](#useful-links)

## Introduction: Why AI Changes Everything
AI introduces probabilistic behavior into interfaces long built on deterministic expectations. Same input can yield different outputs, capabilities feel unbounded yet are constrained, and behavior evolves. Great AI UX aligns mental models, calibrates trust, signals uncertainty, and reveals complexity progressively without overwhelming.

## User Mental Models: Deterministic vs Probabilistic Systems
Users expect consistency, accuracy, and predictable causality; AI delivers variability, uncertainty, fuzzy boundaries, and context-sensitive behavior. Close the expectation gap by making the model visible (process and constraints), showing boundaries early, explaining behavior shifts (e.g., context limits), and teaching through interaction (regenerate, compare, verify).

## Trust Calibration: Overtrust & Undertrust
Appropriate trust sits between blind confidence and avoidance. Prevent overtrust with explicit confidence indicators, capability disclaimers, verification nudges, and visible uncertainty. Address undertrust by demonstrating capabilities early, celebrating successes, explaining failures constructively, and building confidence in steps that match task risk.

## Confidence Signaling Without False Authority
Make certainty a visible spectrum using confidence levels, source attribution, qualified language, and temporal context. Avoid anti-patterns like false precision, anthropomorphic certainty, hidden uncertainty, and over-hedging. Provide alternatives and “why” so users can judge reliability at a glance.

## Progressive Disclosure & Transparency
Use a transparency pyramid: direct answers first, then metadata, reasoning, and deep technical details on demand. Employ collapsible sections, tooltips, tabs, and inline citations. Adapt disclosure to task stakes and remember user preferences to keep trust signals accessible but unobtrusive.

## Conversation as a UI Paradigm
Chat is natural, contextual, and flexible. Treat it as a constraint-driven medium: be clear, handle ambiguity, and state limits upfront. Focus the paradigm on why conversation suits AI (incremental refinement, contextual grounding) and defer mechanics (turn-taking, grounding, continuity) to the “Conversational Design Fundamentals” section.

## Conversational Design Fundamentals
Structure conversations with clear turn-taking, grounding (acknowledgment, clarification, confirmation), and context continuity (immediate, session, historical). Apply the cooperative principle: be truthful, relevant, and concise, with organized responses that match user goals and task complexity.

## Core Chat Interface Patterns
Differentiate message roles (user, AI, system) visually; choose bubbles vs full-width based on content; attach meaningful metadata (timestamps, confidence, citations, token usage); and balance visible vs hover actions. Group actions (feedback, manipulation, utility) to reduce clutter while preserving discoverability.

## Message Display & Interaction Patterns
Optimize code blocks (language, syntax, copy, lines), render markdown cleanly, and make lists/tables responsive. Support inline and interactive citations so users can inspect sources and confidence quickly, enabling verification without breaking conversational flow.


## Streaming & Real‑Time Feedback
Use staged feedback: brief thinking state, stream tokens/chunks, and let users stop/continue. Enable partial copy during streaming, show activity-specific indicators (reading, analyzing, generating), and aim for responsive latency budgets (first token fast, completion controllable).

## Context & Memory Management
Make context visible: badges for active files/messages, token usage bars with warnings, and clear options (summarize & continue, start new chat, download history). Be explicit about session memory vs no persistent memory and provide "clear/reset context" affordances.

## Decision-Making Intelligence (DMI) & AI-Driven Reporting
DMI shifts from data-first dashboards to decision-first interfaces that answer three critical questions: **What changed?** (current state and trends), **Why?** (root causes with confidence levels), and **What next?** (actionable recommendations with expected impact and risk). Unlike traditional BI that displays charts requiring interpretation, DMI uses AI to generate insights, explain reasoning, and suggest specific actions. Key patterns include confidence-scored predictions, comparative analysis with confidence intervals, prioritized recommendations ranked by impact and risk, and always-visible data quality indicators. Present metrics in context of decisions they inform, not as isolated numbers. Use progressive disclosure: executive summary first, supporting data and methodology on demand. Show AI's reasoning process and uncertainty explicitly—DMI isn't about appearing omniscient, but about making complex data actionable while maintaining appropriate trust calibration.

## Agent Safety & Governance
Expose controls and accountability: scopes/permissions, pause/stop/undo, audit trails, and explainability logs. Show planned actions, tool usage, and reversible operations. Calibrate autonomy with gradients and require human review for high‑stakes tasks.

## Privacy & Accessibility
Respect user data with PII handling, redaction, retention transparency, and opt‑in memory. Ensure accessible streaming/content updates (screen reader‑friendly announcements, focus management), color‑safe confidence indicators, captions/alt text for multimodal content.

## Graceful Failure & Recovery
Turn errors into guidance: structured messages that explain cause, offer fixes, and suggest fallbacks (retry with constraints, smaller inputs, offline mode). Preserve progress, enable undo/redo, and degrade gracefully when models/tools are unavailable.

## Short, High-Value Videos

1. **Research@NYC: PAIR Guidebook overview**  
   https://www.youtube.com/watch?v=fgk_mK9XlRs

2. **How to Fail at AI by Ignoring UX**  
   https://www.youtube.com/watch?v=VKbCejSICA8

3. **How to Design UX for AI Products — Best Practices:Scoping**  
   https://www.youtube.com/watch?v=69EokIgHjmU


## Useful links

1. **Google PAIR Guidebook**  
   https://pair.withgoogle.com/guidebook/  
   The most practical AI UX reference available.

2. **Perplexity example UI for AI**  
   https://www.perplexity.ai/