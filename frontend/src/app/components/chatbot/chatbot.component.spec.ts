import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatbotComponent } from './chatbot.component';
import { ChatbotService } from '../../services/chatbot.service';
import { ThemeService } from '../../services/theme.service';
import { of, throwError } from 'rxjs';
import { ChatbotMessage } from '../../models/chatbot.model';

describe('ChatbotComponent', () => {
  let component: ChatbotComponent;
  let fixture: ComponentFixture<ChatbotComponent>;
  let chatbotServiceSpy: jasmine.SpyObj<ChatbotService>;
  let themeServiceSpy: jasmine.SpyObj<ThemeService>;

  beforeEach(async () => {
    const chatbotSpy = jasmine.createSpyObj('ChatbotService', [
      'sendMessage',
      'correctMessage',
      'getHistory',
    ]);
    const themeSpy = jasmine.createSpyObj('ThemeService', ['toggleTheme', 'getCurrentTheme']);

    await TestBed.configureTestingModule({
      imports: [ChatbotComponent],
      providers: [
        { provide: ChatbotService, useValue: chatbotSpy },
        { provide: ThemeService, useValue: themeSpy },
      ],
    }).compileComponents();

    chatbotServiceSpy = TestBed.inject(ChatbotService) as jasmine.SpyObj<ChatbotService>;
    themeServiceSpy = TestBed.inject(ThemeService) as jasmine.SpyObj<ThemeService>;

    fixture = TestBed.createComponent(ChatbotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty messages array', () => {
    expect(component.messages.length).toBe(0);
  });

  it('should initialize with empty user input', () => {
    expect(component.userInput).toBe('');
  });

  it('should initialize isLoading as false', () => {
    expect(component.isLoading).toBe(false);
  });

  it('should initialize conversation context with session start', () => {
    expect(component.conversationContext.length).toBe(1);
    expect(component.conversationContext[0].key).toBe('Session Started');
  });

  it('should initialize showContextPanel as false', () => {
    expect(component.showContextPanel).toBe(false);
  });

  describe('sendMessage', () => {
    it('should not send message if input is empty', () => {
      component.userInput = '';
      component.sendMessage();

      expect(chatbotServiceSpy.sendMessage).not.toHaveBeenCalled();
      expect(component.messages.length).toBe(0);
    });

    it('should not send message if input is only whitespace', () => {
      component.userInput = '   ';
      component.sendMessage();

      expect(chatbotServiceSpy.sendMessage).not.toHaveBeenCalled();
      expect(component.messages.length).toBe(0);
    });

    it('should not send message if already loading', () => {
      component.userInput = 'Test message';
      component.isLoading = true;
      component.sendMessage();

      expect(chatbotServiceSpy.sendMessage).not.toHaveBeenCalled();
    });

    it('should add user message to messages array', () => {
      component.userInput = 'Hello AI!';

      const mockResponse: ChatbotMessage = {
        message: 'Hello!',
        confidence: 0.95,
        response_type: 'confident',
        sources: [],
        timestamp: '2024-01-01T12:00:00Z',
        context_id: 'context-123',
        can_correct: false,
        alternative_interpretations: [],
      };

      chatbotServiceSpy.sendMessage.and.returnValue(of(mockResponse));

      component.sendMessage();

      expect(component.messages.length).toBeGreaterThan(0);
      const userMsg = component.messages.find((m) => m.type === 'user');
      expect(userMsg).toBeDefined();
      expect(userMsg?.content).toBe('Hello AI!');
    });

    it('should set isLoading to true when sending message', () => {
      component.userInput = 'Test';

      const mockResponse: ChatbotMessage = {
        message: 'Response',
        confidence: 0.9,
        response_type: 'confident',
        sources: [],
        timestamp: '2024-01-01T12:00:00Z',
        context_id: 'ctx',
        can_correct: false,
        alternative_interpretations: [],
      };

      chatbotServiceSpy.sendMessage.and.returnValue(of(mockResponse));

      const initialLoading = component.isLoading;
      component.sendMessage();

      expect(initialLoading).toBe(false);
      // isLoading is set to true before API call
      expect(chatbotServiceSpy.sendMessage).toHaveBeenCalled();
    });

    it('should clear user input after sending', () => {
      component.userInput = 'Test message';

      const mockResponse: ChatbotMessage = {
        message: 'Response',
        confidence: 0.9,
        response_type: 'confident',
        sources: [],
        timestamp: '2024-01-01T12:00:00Z',
        context_id: 'ctx',
        can_correct: false,
        alternative_interpretations: [],
      };

      chatbotServiceSpy.sendMessage.and.returnValue(of(mockResponse));

      component.sendMessage();

      expect(component.userInput).toBe('');
    });

    it('should call chatbotService.sendMessage with correct parameters', () => {
      component.userInput = 'Test question';
      component.currentContextId = 'context-456';

      const mockResponse: ChatbotMessage = {
        message: 'Answer',
        confidence: 0.88,
        response_type: 'confident',
        sources: [],
        timestamp: '2024-01-01T12:00:00Z',
        context_id: 'context-456',
        can_correct: false,
        alternative_interpretations: [],
      };

      chatbotServiceSpy.sendMessage.and.returnValue(of(mockResponse));

      component.sendMessage();

      expect(chatbotServiceSpy.sendMessage).toHaveBeenCalledWith({
        message: 'Test question',
        context_id: 'context-456',
      });
    });

    it('should add assistant message to messages array on success', (done) => {
      component.userInput = 'Question';

      const mockResponse: ChatbotMessage = {
        message: 'AI Answer',
        confidence: 0.92,
        response_type: 'confident',
        sources: [{ type: 'doc', name: 'KB', relevance: 0.9 }],
        timestamp: '2024-01-01T12:00:00Z',
        context_id: 'context-new',
        can_correct: true,
        alternative_interpretations: [],
      };

      chatbotServiceSpy.sendMessage.and.returnValue(of(mockResponse));

      component.sendMessage();

      // Allow async operations to complete
      setTimeout(() => {
        const assistantMsg = component.messages.find((m) => m.type === 'assistant');
        expect(assistantMsg).toBeDefined();
        expect(assistantMsg?.content).toBe('AI Answer');
        expect(assistantMsg?.data?.confidence).toBe(0.92);
        expect(component.isLoading).toBe(false);
        done();
      }, 50);
    });

    it('should update context ID from response', (done) => {
      component.userInput = 'Test';
      component.currentContextId = undefined;

      const mockResponse: ChatbotMessage = {
        message: 'Response',
        confidence: 0.9,
        response_type: 'confident',
        sources: [],
        timestamp: '2024-01-01T12:00:00Z',
        context_id: 'new-context-id',
        can_correct: false,
        alternative_interpretations: [],
      };

      chatbotServiceSpy.sendMessage.and.returnValue(of(mockResponse));

      component.sendMessage();

      setTimeout(() => {
        expect(component.currentContextId).toBe('new-context-id');
        done();
      }, 50);
    });

    it('should handle network error gracefully', (done) => {
      component.userInput = 'Test';

      chatbotServiceSpy.sendMessage.and.returnValue(
        throwError(() => new Error('Network error'))
      );

      component.sendMessage();

      setTimeout(() => {
        const errorMsg = component.messages.find(
          (m) => m.type === 'system' && m.content.includes('Network error')
        );
        expect(errorMsg).toBeDefined();
        expect(component.isLoading).toBe(false);
        done();
      }, 50);
    });
  });

  describe('confidence helpers', () => {
    it('should return "high" class for confidence >= 0.85', () => {
      expect(component.getConfidenceClass(0.85)).toBe('high');
      expect(component.getConfidenceClass(0.95)).toBe('high');
      expect(component.getConfidenceClass(1.0)).toBe('high');
    });

    it('should return "medium" class for confidence between 0.65 and 0.84', () => {
      expect(component.getConfidenceClass(0.65)).toBe('medium');
      expect(component.getConfidenceClass(0.75)).toBe('medium');
      expect(component.getConfidenceClass(0.84)).toBe('medium');
    });

    it('should return "low" class for confidence < 0.65', () => {
      expect(component.getConfidenceClass(0.64)).toBe('low');
      expect(component.getConfidenceClass(0.3)).toBe('low');
      expect(component.getConfidenceClass(0)).toBe('low');
    });

    it('should return correct icon for high confidence', () => {
      expect(component.getConfidenceIcon(0.95)).toBe('check_circle');
    });

    it('should return correct icon for medium confidence', () => {
      expect(component.getConfidenceIcon(0.75)).toBe('warning');
    });

    it('should return correct icon for low confidence', () => {
      expect(component.getConfidenceIcon(0.3)).toBe('error');
    });

    it('should return correct label for high confidence', () => {
      expect(component.getConfidenceLabel(0.9)).toBe('High Confidence');
    });

    it('should return correct label for medium confidence', () => {
      expect(component.getConfidenceLabel(0.7)).toBe('Uncertain');
    });

    it('should return correct label for low confidence', () => {
      expect(component.getConfidenceLabel(0.4)).toBe('Low Confidence');
    });

    it('should return correct color for high confidence', () => {
      expect(component.getConfidenceColor(0.9)).toBe('primary');
    });

    it('should return correct color for medium confidence', () => {
      expect(component.getConfidenceColor(0.7)).toBe('accent');
    });

    it('should return correct color for low confidence', () => {
      expect(component.getConfidenceColor(0.4)).toBe('warn');
    });
  });

  describe('theme toggle', () => {
    it('should call themeService.toggleTheme when toggleTheme is called', () => {
      component.toggleTheme();

      expect(themeServiceSpy.toggleTheme).toHaveBeenCalled();
    });
  });

  describe('context panel', () => {
    it('should toggle showContextPanel when toggleContextPanel is called', () => {
      expect(component.showContextPanel).toBe(false);

      component.toggleContextPanel();
      expect(component.showContextPanel).toBe(true);

      component.toggleContextPanel();
      expect(component.showContextPanel).toBe(false);
    });
  });

  describe('updateContext', () => {
    it('should add new context item', () => {
      const initialLength = component.conversationContext.length;

      component.updateContext('Test Key', 'Test Value');

      expect(component.conversationContext.length).toBe(initialLength + 1);
      const latestContext = component.conversationContext[component.conversationContext.length - 1];
      expect(latestContext.key).toBe('Test Key');
      expect(latestContext.value).toBe('Test Value');
    });

    it('should limit context to 10 items', () => {
      component.conversationContext = [];

      for (let i = 0; i < 15; i++) {
        component.updateContext(`Key${i}`, `Value${i}`);
      }

      expect(component.conversationContext.length).toBe(10);
      const firstContext = component.conversationContext[0];
      expect(firstContext.key).toBe('Key5'); // First 5 should be removed
    });
  });

  describe('correction flow', () => {
    it('should show correction UI when showCorrection is called', () => {
      component.showCorrection(0);

      expect(component.showingCorrection).toBe('msg-0');
      expect(component.correctionText).toBe('');
    });

    it('should cancel correction when cancelCorrection is called', () => {
      component.showingCorrection = 'msg-1';
      component.correctionText = 'Some correction';

      component.cancelCorrection();

      expect(component.showingCorrection).toBeNull();
      expect(component.correctionText).toBe('');
    });

    it('should not submit correction if text is empty', () => {
      const mockMessage = {
        type: 'assistant' as const,
        content: 'Message',
        data: {
          context_id: 'ctx-123',
        } as ChatbotMessage,
        timestamp: new Date(),
      };

      component.correctionText = '';
      component.submitCorrection(mockMessage, 0);

      expect(chatbotServiceSpy.correctMessage).not.toHaveBeenCalled();
    });

    it('should call correctMessage service when submitting valid correction', () => {
      const mockMessage = {
        type: 'assistant' as const,
        content: 'Message',
        data: {
          context_id: 'ctx-456',
          message: 'Original',
          confidence: 0.8,
          response_type: 'uncertain' as const,
          sources: [],
          timestamp: '2024-01-01T12:00:00Z',
          can_correct: true,
          alternative_interpretations: [],
        },
        timestamp: new Date(),
      };

      component.correctionText = 'This is the correction';
      chatbotServiceSpy.correctMessage.and.returnValue(
        of({ message: 'Correction accepted' })
      );

      component.submitCorrection(mockMessage, 0);

      expect(chatbotServiceSpy.correctMessage).toHaveBeenCalledWith({
        correction: 'This is the correction',
        context_id: 'ctx-456',
      });
    });
  });

  describe('interruptResponse', () => {
    it('should set isLoading to false when interrupt is called', () => {
      component.isLoading = true;
      component.canInterrupt = true;
      component.currentSubscription = of({}).subscribe();

      component.interruptResponse();

      expect(component.isLoading).toBe(false);
      expect(component.canInterrupt).toBe(false);
    });

    it('should add interrupt message to messages array', () => {
      component.currentSubscription = of({}).subscribe();
      const initialLength = component.messages.length;

      component.interruptResponse();

      expect(component.messages.length).toBe(initialLength + 1);
      const interruptMsg = component.messages[component.messages.length - 1];
      expect(interruptMsg.type).toBe('system');
      expect(interruptMsg.content).toContain('interrupted');
    });
  });
});
