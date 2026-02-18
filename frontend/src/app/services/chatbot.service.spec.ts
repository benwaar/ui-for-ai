import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { ChatbotService } from './chatbot.service';
import {
  ChatbotMessage,
  ChatbotRequest,
  ChatbotCorrection,
  ConversationHistory,
} from '../models/chatbot.model';
import { firstValueFrom } from 'rxjs';

describe('ChatbotService', () => {
  let service: ChatbotService;
  let httpMock: HttpTestingController;

  const baseUrl = 'http://localhost:5000/api/chatbot';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChatbotService, provideHttpClient(), provideHttpClientTesting()],
    });
    httpMock = TestBed.inject(HttpTestingController);
    service = TestBed.inject(ChatbotService);
  });

  afterEach(() => {
    httpMock.verify();
    TestBed.resetTestingModule();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('sendMessage', () => {
    it('should make POST request to /api/chatbot/message', () => {
      const request: ChatbotRequest = {
        message: 'Hello, AI!',
        context_id: 'context-123',
      };

      service.sendMessage(request).subscribe();

      const req = httpMock.expectOne(`${baseUrl}/message`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(request);

      req.flush({} as ChatbotMessage);
    });

    it('should return ChatbotMessage observable', async () => {
      const request: ChatbotRequest = {
        message: 'Test message',
      };

      const mockResponse: ChatbotMessage = {
        message: 'AI response',
        confidence: 0.95,
        response_type: 'confident',
        sources: [
          {
            type: 'document',
            name: 'KB Article 123',
            relevance: 0.9,
          },
        ],
        tools_used: [
          {
            name: 'SearchTool',
            description: 'Searched knowledge base',
            execution_time_ms: 150,
            success: true,
          },
        ],
        timestamp: '2024-01-01T12:00:00Z',
        context_id: 'context-456',
        can_correct: true,
        alternative_interpretations: [],
      };

      const promise = firstValueFrom(service.sendMessage(request));
      const req = httpMock.expectOne(`${baseUrl}/message`);
      req.flush(mockResponse);

      const response = await promise;
      expect(response).toEqual(mockResponse);
      expect(response.confidence).toBe(0.95);
      expect(response.sources.length).toBe(1);
      expect(response.tools_used?.length).toBe(1);
    });

    it('should handle HTTP error (500)', async () => {
      const request: ChatbotRequest = {
        message: 'Test',
      };

      const promise = firstValueFrom(service.sendMessage(request));
      const req = httpMock.expectOne(`${baseUrl}/message`);
      req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });

      await expect(promise).rejects.toThrow();
    });

    it('should handle network error', async () => {
      const request: ChatbotRequest = {
        message: 'Test',
      };

      const promise = firstValueFrom(service.sendMessage(request));
      const req = httpMock.expectOne(`${baseUrl}/message`);
      req.error(new ProgressEvent('error'));

      await expect(promise).rejects.toThrow();
    });

    it('should handle low confidence response', async () => {
      const request: ChatbotRequest = {
        message: 'Ambiguous question',
      };

      const mockResponse: ChatbotMessage = {
        message: "I'm not sure what you mean",
        confidence: 0.3,
        response_type: 'low_confidence',
        sources: [],
        timestamp: '2024-01-01T12:00:00Z',
        context_id: 'context-789',
        can_correct: true,
        alternative_interpretations: ['Option 1', 'Option 2'],
      };

      const promise = firstValueFrom(service.sendMessage(request));
      const req = httpMock.expectOne(`${baseUrl}/message`);
      req.flush(mockResponse);

      const response = await promise;
      expect(response.confidence).toBe(0.3);
      expect(response.response_type).toBe('low_confidence');
      expect(response.alternative_interpretations.length).toBe(2);
    });

    it('should handle timeout failure state', async () => {
      const request: ChatbotRequest = {
        message: 'Complex query',
      };

      const mockResponse: ChatbotMessage = {
        message: 'Request timed out',
        confidence: 0,
        response_type: 'timeout',
        sources: [],
        timestamp: '2024-01-01T12:00:00Z',
        context_id: 'context-timeout',
        can_correct: false,
        alternative_interpretations: [],
        failure_state: {
          type: 'timeout',
          message: 'The request took too long to process',
          retry_suggested: true,
          user_action: 'Please try again or simplify your query',
        },
      };

      const promise = firstValueFrom(service.sendMessage(request));
      const req = httpMock.expectOne(`${baseUrl}/message`);
      req.flush(mockResponse);

      const response = await promise;
      expect(response.response_type).toBe('timeout');
      expect(response.failure_state).toBeDefined();
      expect(response.failure_state?.retry_suggested).toBe(true);
    });
  });

  describe('correctMessage', () => {
    it('should make POST request to /api/chatbot/correct', () => {
      const correction: ChatbotCorrection = {
        correction: 'I meant option A, not option B',
        context_id: 'context-correct',
      };

      service.correctMessage(correction).subscribe();

      const req = httpMock.expectOne(`${baseUrl}/correct`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(correction);

      req.flush({ success: true });
    });

    it('should return observable with correction response', async () => {
      const correction: ChatbotCorrection = {
        correction: 'Corrected input',
        context_id: 'context-123',
      };

      const mockResponse = {
        success: true,
        message: 'Correction applied',
      };

      const promise = firstValueFrom(service.correctMessage(correction));
      const req = httpMock.expectOne(`${baseUrl}/correct`);
      req.flush(mockResponse);

      const response = await promise;
      expect(response).toEqual(mockResponse);
    });

    it('should handle correction error', async () => {
      const correction: ChatbotCorrection = {
        correction: 'Invalid correction',
        context_id: 'invalid-context',
      };

      const promise = firstValueFrom(service.correctMessage(correction));
      const req = httpMock.expectOne(`${baseUrl}/correct`);
      req.flush('Bad Request', { status: 400, statusText: 'Bad Request' });

      await expect(promise).rejects.toThrow();
    });
  });

  describe('getHistory', () => {
    it('should make GET request to /api/chatbot/history', () => {
      service.getHistory().subscribe();

      const req = httpMock.expectOne(`${baseUrl}/history`);
      expect(req.request.method).toBe('GET');

      req.flush({} as ConversationHistory);
    });

    it('should return ConversationHistory observable', async () => {
      const mockHistory: ConversationHistory = {
        history: [
          {
            user: 'Hello!',
            assistant: {
              message: 'Hi there!',
              confidence: 0.95,
              response_type: 'confident',
              sources: [],
              timestamp: '2024-01-01T12:00:00Z',
              context_id: 'context-1',
              can_correct: false,
              alternative_interpretations: [],
            },
            timestamp: '2024-01-01T12:00:00Z',
          },
          {
            user: 'How are you?',
            assistant: {
              message: "I'm doing well, thanks!",
              confidence: 0.92,
              response_type: 'confident',
              sources: [],
              timestamp: '2024-01-01T12:01:00Z',
              context_id: 'context-2',
              can_correct: false,
              alternative_interpretations: [],
            },
            timestamp: '2024-01-01T12:01:00Z',
          },
        ],
        total_messages: 2,
      };

      const promise = firstValueFrom(service.getHistory());
      const req = httpMock.expectOne(`${baseUrl}/history`);
      req.flush(mockHistory);

      const history = await promise;
      expect(history).toEqual(mockHistory);
      expect(history.history.length).toBe(2);
      expect(history.total_messages).toBe(2);
    });

    it('should handle history retrieval error', async () => {
      const promise = firstValueFrom(service.getHistory());
      const req = httpMock.expectOne(`${baseUrl}/history`);
      req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });

      await expect(promise).rejects.toThrow();
    });

    it('should handle empty history', async () => {
      const emptyHistory: ConversationHistory = {
        history: [],
        total_messages: 0,
      };

      const promise = firstValueFrom(service.getHistory());
      const req = httpMock.expectOne(`${baseUrl}/history`);
      req.flush(emptyHistory);

      const history = await promise;
      expect(history.history.length).toBe(0);
      expect(history.total_messages).toBe(0);
    });
  });
});
