import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatbotService } from '../../services/chatbot.service';
import { ChatbotMessage } from '../../models/chatbot.model';
import { Subscription } from 'rxjs';

interface MessageDisplay {
  type: 'user' | 'assistant' | 'system';
  content: string;
  data?: ChatbotMessage;
  timestamp: Date;
  isInterruptible?: boolean;
}

interface ContextItem {
  key: string;
  value: string;
  timestamp: Date;
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss']
})
export class ChatbotComponent {
  messages: MessageDisplay[] = [];
  userInput = '';
  isLoading = false;
  currentContextId?: string;
  showingCorrection: string | null = null;
  correctionText = '';
  conversationContext: ContextItem[] = [];
  showContextPanel = false;
  currentSubscription?: Subscription;
  canInterrupt = false;
  messageCount = 0;

  constructor(
    private chatbotService: ChatbotService,
    private cdr: ChangeDetectorRef
  ) {
    this.initializeContext();
  }

  initializeContext(): void {
    this.conversationContext.push({
      key: 'Session Started',
      value: new Date().toLocaleString(),
      timestamp: new Date()
    });
  }

  updateContext(key: string, value: string): void {
    this.conversationContext.push({
      key,
      value,
      timestamp: new Date()
    });
    if (this.conversationContext.length > 10) {
      this.conversationContext = this.conversationContext.slice(-10);
    }
  }

  toggleContextPanel(): void {
    this.showContextPanel = !this.showContextPanel;
  }

  interruptResponse(): void {
    if (this.currentSubscription) {
      this.currentSubscription.unsubscribe();
      this.isLoading = false;
      this.canInterrupt = false;
      this.messages.push({
        type: 'system',
        content: '⚠️ Response interrupted by user',
        timestamp: new Date()
      });
      this.cdr.detectChanges();
    }
  }

  sendMessage(): void {
    if (!this.userInput.trim() || this.isLoading) return;

    const userMessage = this.userInput.trim();
    this.messageCount++;

    // Simulate rate limiting after 10 messages
    if (this.messageCount > 10) {
      this.messages.push({
        type: 'user',
        content: userMessage,
        timestamp: new Date()
      });
      this.messages.push({
        type: 'system',
        content: '⚠️ Rate limit exceeded. Please wait before sending more messages.',
        data: {
          message: 'Rate limit exceeded. Please wait 30 seconds.',
          confidence: 0,
          response_type: 'rate_limited',
          sources: [],
          timestamp: new Date().toISOString(),
          context_id: this.currentContextId || '',
          can_correct: false,
          alternative_interpretations: [],
          failure_state: {
            type: 'rate_limited',
            message: 'Too many requests in a short time',
            retry_suggested: true,
            user_action: 'Wait 30 seconds before retrying'
          }
        },
        timestamp: new Date()
      });
      this.userInput = '';
      this.cdr.detectChanges();
      return;
    }

    // Add user message to display
    this.messages.push({
      type: 'user',
      content: userMessage,
      timestamp: new Date()
    });
    this.updateContext('User Query', userMessage);
    this.cdr.detectChanges();

    this.userInput = '';
    this.isLoading = true;
    this.canInterrupt = true;

    // Simulate timeout for specific queries
    if (userMessage.toLowerCase().includes('slow') || userMessage.toLowerCase().includes('timeout')) {
      setTimeout(() => {
        this.isLoading = false;
        this.canInterrupt = false;
        this.messages.push({
          type: 'system',
          content: '⏱️ Request timed out. The system took too long to respond.',
          data: {
            message: 'Request timed out after 30 seconds',
            confidence: 0,
            response_type: 'timeout',
            sources: [],
            timestamp: new Date().toISOString(),
            context_id: this.currentContextId || '',
            can_correct: false,
            alternative_interpretations: [],
            failure_state: {
              type: 'timeout',
              message: 'Request exceeded maximum processing time',
              retry_suggested: true,
              user_action: 'Try rephrasing or simplifying your question'
            }
          },
          timestamp: new Date()
        });
        this.cdr.detectChanges();
      }, 3000);
      return;
    }

    // Simulate ambiguous query
    if (userMessage.toLowerCase().includes('that') || userMessage.toLowerCase().includes('it')) {
      this.isLoading = false;
      this.canInterrupt = false;
      this.messages.push({
        type: 'system',
        content: '❓ Your question is ambiguous. I need more context to provide a helpful answer.',
        data: {
          message: 'Ambiguous reference detected',
          confidence: 0.3,
          response_type: 'ambiguous',
          sources: [],
          timestamp: new Date().toISOString(),
          context_id: this.currentContextId || '',
          can_correct: true,
          alternative_interpretations: [
            'Are you asking about the authentication system?',
            'Are you referring to the routing configuration?',
            'Do you mean the previous topic we discussed?'
          ],
          failure_state: {
            type: 'ambiguous',
            message: 'Cannot determine what "that" or "it" refers to',
            retry_suggested: true,
            user_action: 'Please be more specific in your question'
          }
        },
        timestamp: new Date()
      });
      this.cdr.detectChanges();
      return;
    }

    // Simulate context loss
    if (this.messageCount > 8 && Math.random() > 0.7) {
      this.isLoading = false;
      this.canInterrupt = false;
      this.currentContextId = undefined;
      this.messages.push({
        type: 'system',
        content: '🔄 Context lost. Starting a new conversation thread.',
        data: {
          message: 'Conversation context was lost',
          confidence: 0,
          response_type: 'context_lost',
          sources: [],
          timestamp: new Date().toISOString(),
          context_id: '',
          can_correct: false,
          alternative_interpretations: [],
          failure_state: {
            type: 'context_lost',
            message: 'Session context expired or was lost',
            retry_suggested: true,
            user_action: 'Please repeat your question with full context'
          }
        },
        timestamp: new Date()
      });
      this.conversationContext = [];
      this.initializeContext();
      this.updateContext('Context Reset', 'Context lost and reinitialized');
      this.cdr.detectChanges();
      return;
    }

    // Send to API
    console.log('Sending message:', userMessage);
    this.currentSubscription = this.chatbotService.sendMessage({
      message: userMessage,
      context_id: this.currentContextId
    }).subscribe({
      next: (response) => {
        console.log('Received response:', response);
        this.currentContextId = response.context_id;
        this.updateContext('AI Response Type', response.response_type);
        this.updateContext('Confidence', `${(response.confidence * 100).toFixed(0)}%`);
        this.messages.push({
          type: 'assistant',
          content: response.message,
          data: response,
          timestamp: new Date(),
          isInterruptible: false
        });
        console.log('Messages array:', this.messages);
        this.isLoading = false;
        this.canInterrupt = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error sending message:', error);
        this.messages.push({
          type: 'system',
          content: '❌ Network error: Unable to connect to the chatbot service.',
          data: {
            message: 'Network error',
            confidence: 0,
            response_type: 'timeout',
            sources: [],
            timestamp: new Date().toISOString(),
            context_id: this.currentContextId || '',
            can_correct: false,
            alternative_interpretations: [],
            failure_state: {
              type: 'network_error',
              message: 'Could not establish connection to server',
              retry_suggested: true,
              user_action: 'Check your internet connection and try again'
            }
          },
          timestamp: new Date()
        });
        this.isLoading = false;
        this.canInterrupt = false;
        this.cdr.detectChanges();
      }
    });
  }

  getConfidenceClass(confidence: number): string {
    if (confidence >= 0.85) return 'high-confidence';
    if (confidence >= 0.65) return 'medium-confidence';
    return 'low-confidence';
  }

  getConfidenceLabel(confidence: number): string {
    if (confidence >= 0.85) return 'High Confidence';
    if (confidence >= 0.65) return 'Uncertain';
    return 'Low Confidence';
  }

  showCorrection(messageIndex: number): void {
    this.showingCorrection = `msg-${messageIndex}`;
    this.correctionText = '';
  }

  cancelCorrection(): void {
    this.showingCorrection = null;
    this.correctionText = '';
  }

  submitCorrection(message: MessageDisplay, index: number): void {
    if (!this.correctionText.trim() || !message.data) return;

    this.chatbotService.correctMessage({
      correction: this.correctionText,
      context_id: message.data.context_id
    }).subscribe({
      next: (response) => {
        // Add correction acknowledgment
        this.messages.push({
          type: 'assistant',
          content: response.message,
          data: {
            ...response,
            response_type: 'confident',
            sources: [],
            can_correct: false,
            alternative_interpretations: []
          },
          timestamp: new Date()
        });
        this.showingCorrection = null;
        this.correctionText = '';
      },
      error: (error) => {
        console.error('Error correcting:', error);
      }
    });
  }

  loadHistory(): void {
    this.chatbotService.getHistory().subscribe({
      next: (history) => {
        console.log('Conversation history:', history);
      },
      error: (error) => {
        console.error('Error loading history:', error);
      }
    });
  }
}
