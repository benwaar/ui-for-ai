export interface ChatbotMessage {
  message: string;
  confidence: number;
  response_type: 'confident' | 'uncertain' | 'low_confidence' | 'timeout' | 'ambiguous' | 'context_lost' | 'rate_limited';
  sources: ChatbotSource[];
  tools_used?: ChatbotTool[];
  timestamp: string;
  context_id: string;
  can_correct: boolean;
  alternative_interpretations: string[];
  failure_state?: FailureState;
}

export interface ChatbotSource {
  type: string;
  name: string;
  relevance: number;
}

export interface ChatbotTool {
  name: string;
  description: string;
  execution_time_ms?: number;
  success: boolean;
}

export interface FailureState {
  type: 'timeout' | 'ambiguous' | 'context_lost' | 'rate_limited' | 'network_error';
  message: string;
  retry_suggested: boolean;
  user_action?: string;
}

export interface ChatbotRequest {
  message: string;
  context_id?: string;
}

export interface ChatbotCorrection {
  correction: string;
  context_id: string;
}

export interface ConversationHistory {
  history: Array<{
    user: string;
    assistant: ChatbotMessage;
    timestamp: string;
  }>;
  total_messages: number;
}
