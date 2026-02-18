import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { AgentService } from './agent.service';
import { AgentState, AgentStartRequest, AgentModifyRequest, AgentActionLog } from '../models/agent.model';
import { firstValueFrom } from 'rxjs';

describe('AgentService', () => {
  let service: AgentService;
  let httpMock: HttpTestingController;

  const baseUrl = 'http://localhost:5000/api/agent';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AgentService, provideHttpClient(), provideHttpClientTesting()],
    });
    httpMock = TestBed.inject(HttpTestingController);
    service = TestBed.inject(AgentService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getStatus', () => {
    it('should make GET request to /api/agent/status', () => {
      service.getStatus().subscribe();

      const req = httpMock.expectOne(`${baseUrl}/status`);
      expect(req.request.method).toBe('GET');

      req.flush({} as AgentState);
    });

    it('should return AgentState observable', async () => {
      const mockState: AgentState = {
        status: 'idle',
        current_goal: null,
        progress: 0,
        timestamp: '2024-01-01T12:00:00Z',
      };

      const promise = firstValueFrom(service.getStatus());
      const req = httpMock.expectOne(`${baseUrl}/status`);
      req.flush(mockState);

      const state = await promise;
      expect(state).toEqual(mockState);
      expect(state.status).toBe('idle');
    });

    it('should handle error when getting status', async () => {
      const promise = firstValueFrom(service.getStatus());
      const req = httpMock.expectOne(`${baseUrl}/status`);
      req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });

      await expect(promise).rejects.toThrow();
    });
  });

  describe('start', () => {
    it('should make POST request to /api/agent/start with request body', () => {
      const startRequest: AgentStartRequest = {
        goal: 'Complete task A',
        constraints: ['Use only verified data'],
      };

      service.start(startRequest).subscribe();

      const req = httpMock.expectOne(`${baseUrl}/start`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(startRequest);

      req.flush({} as AgentState);
    });

    it('should return AgentState after starting', async () => {
      const startRequest: AgentStartRequest = {
        goal: 'Test goal',
      };

      const mockState: AgentState = {
        status: 'running',
        current_goal: 'Test goal',
        progress: 0,
        timestamp: '2024-01-01T12:00:00Z',
      };

      const promise = firstValueFrom(service.start(startRequest));
      const req = httpMock.expectOne(`${baseUrl}/start`);
      req.flush(mockState);

      const state = await promise;
      expect(state.status).toBe('running');
      expect(state.current_goal).toBe('Test goal');
    });
  });

  describe('pause', () => {
    it('should make POST request to /api/agent/pause', () => {
      service.pause().subscribe();

      const req = httpMock.expectOne(`${baseUrl}/pause`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({});

      req.flush({} as AgentState);
    });

    it('should return AgentState with paused status', async () => {
      const mockState: AgentState = {
        status: 'paused',
        current_goal: 'Test goal',
        progress: 50,
        timestamp: '2024-01-01T12:00:00Z',
      };

      const promise = firstValueFrom(service.pause());
      const req = httpMock.expectOne(`${baseUrl}/pause`);
      req.flush(mockState);

      const state = await promise;
      expect(state.status).toBe('paused');
    });
  });

  describe('resume', () => {
    it('should make POST request to /api/agent/resume', () => {
      service.resume().subscribe();

      const req = httpMock.expectOne(`${baseUrl}/resume`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({});

      req.flush({} as AgentState);
    });

    it('should return AgentState with running status', async () => {
      const mockState: AgentState = {
        status: 'running',
        current_goal: 'Test goal',
        progress: 50,
        timestamp: '2024-01-01T12:00:00Z',
      };

      const promise = firstValueFrom(service.resume());
      const req = httpMock.expectOne(`${baseUrl}/resume`);
      req.flush(mockState);

      const state = await promise;
      expect(state.status).toBe('running');
    });
  });

  describe('stop', () => {
    it('should make POST request to /api/agent/stop', () => {
      service.stop().subscribe();

      const req = httpMock.expectOne(`${baseUrl}/stop`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({});

      req.flush({} as AgentState);
    });

    it('should return AgentState with stopped status', async () => {
      const mockState: AgentState = {
        status: 'stopped',
        current_goal: null,
        progress: 0,
        timestamp: '2024-01-01T12:00:00Z',
      };

      const promise = firstValueFrom(service.stop());
      const req = httpMock.expectOne(`${baseUrl}/stop`);
      req.flush(mockState);

      const state = await promise;
      expect(state.status).toBe('stopped');
      expect(state.current_goal).toBeNull();
    });
  });

  describe('modify', () => {
    it('should make POST request to /api/agent/modify with request body', () => {
      const modifyRequest: AgentModifyRequest = {
        new_goal: 'Updated goal',
        additional_constraints: ['New constraint'],
      };

      service.modify(modifyRequest).subscribe();

      const req = httpMock.expectOne(`${baseUrl}/modify`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(modifyRequest);

      req.flush({} as AgentState);
    });

    it('should return updated AgentState', async () => {
      const modifyRequest: AgentModifyRequest = {
        new_goal: 'Modified goal',
      };

      const mockState: AgentState = {
        status: 'running',
        current_goal: 'Modified goal',
        progress: 25,
        timestamp: '2024-01-01T12:00:00Z',
      };

      const promise = firstValueFrom(service.modify(modifyRequest));
      const req = httpMock.expectOne(`${baseUrl}/modify`);
      req.flush(mockState);

      const state = await promise;
      expect(state.current_goal).toBe('Modified goal');
    });
  });

  describe('getActionLog', () => {
    it('should make GET request to /api/agent/action-log', () => {
      service.getActionLog().subscribe();

      const req = httpMock.expectOne(`${baseUrl}/action-log`);
      expect(req.request.method).toBe('GET');

      req.flush({} as AgentActionLog);
    });

    it('should return AgentActionLog observable', async () => {
      const mockLog: AgentActionLog = {
        actions: [
          {
            action: 'start',
            timestamp: '2024-01-01T12:00:00Z',
            description: 'Agent started',
          },
          {
            action: 'step',
            timestamp: '2024-01-01T12:01:00Z',
            description: 'Processing step 1',
          },
        ],
        total_actions: 2,
      };

      const promise = firstValueFrom(service.getActionLog());
      const req = httpMock.expectOne(`${baseUrl}/action-log`);
      req.flush(mockLog);

      const log = await promise;
      expect(log).toEqual(mockLog);
      expect(log.actions.length).toBe(2);
      expect(log.total_actions).toBe(2);
    });

    it('should handle error when getting action log', async () => {
      const promise = firstValueFrom(service.getActionLog());
      const req = httpMock.expectOne(`${baseUrl}/action-log`);
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });

      await expect(promise).rejects.toThrow();
    });
  });
});
