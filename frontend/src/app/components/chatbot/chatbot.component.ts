import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatbotService } from '../../services/chatbot.service';
import { ChatbotMessage } from '../../models/chatbot.model';

interface MessageDisplay {
  type: 'user' | 'assistant';
  content: string;
  data?: ChatbotMessage;
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

  constructor(
    private chatbotService: ChatbotService,
    private cdr: ChangeDetectorRef
  ) {}

  sendMessage(): void {
    if (!this.userInput.trim() || this.isLoading) return;

    const userMessage = this.userInput.trim();

    // Add user message to display
    this.messages.push({
      type: 'user',
      content: userMessage,
      timestamp: new Date()
    });
    this.cdr.detectChanges();

    this.userInput = '';
    this.isLoading = true;

    // Send to API
    console.log('Sending message:', userMessage);
    this.chatbotService.sendMessage({
      message: userMessage,
      context_id: this.currentContextId
    }).subscribe({
      next: (response) => {
        console.log('Received response:', response);
        this.currentContextId = response.context_id;
        this.messages.push({
          type: 'assistant',
          content: response.message,
          data: response,
          timestamp: new Date()
        });
        console.log('Messages array:', this.messages);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error sending message:', error);
        this.messages.push({
          type: 'assistant',
          content: 'Error: Unable to connect to the chatbot service. This is a failure state demonstration.',
          timestamp: new Date()
        });
        this.isLoading = false;
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
