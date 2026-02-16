export interface ChatbotMessage {
  message: string;
  confidence: number;
  response_type: 'confident' | 'uncertain' | 'low_confidence';
  sources: ChatbotSource[];
  timestamp: string;
  context_id: string;
  can_correct: boolean;
  alternative_interpretations: string[];
}

export interface ChatbotSource {
  type: string;
  name: string;
  relevance: number;
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
