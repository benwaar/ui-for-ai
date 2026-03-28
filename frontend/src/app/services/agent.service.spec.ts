import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { AgentService } from './agent.service';
import { AgentActionLog, AgentModifyRequest, AgentStartRequest, AgentState } from '../models/agent.model';

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

  const mockState: AgentState = {
    status: 'running',
    current_goal: 'Test goal',
    autonomy_level: 'semi-auto',
    subtasks: [
      {
        id: 1,
        task: 'Analyze repository',
        status: 'in_progress',
        progress: 50,
      },
    ],
    started_at: '2026-03-28T12:00:00Z',
    action_log: [
      {
        timestamp: '2026-03-28T12:00:00Z',
        action: 'start',
        details: 'Agent started with test goal',
      },
    ],
  };

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getStatus', () => {
    it('should make GET request to /api/agent/status', () => {
      service.getStatus().subscribe();

      const req = httpMock.expectOne(`${baseUrl}/status`);
      expect(req.request.method).toBe('GET');

      req.flush(mockState);
    });

    it('should return AgentState observable', async () => {
      const promise = firstValueFrom(service.getStatus());
      const req = httpMock.expectOne(`${baseUrl}/status`);
      req.flush(mockState);

      const state = await promise;
      expect(state).toEqual(mockState);
      expect(state.status).toBe('running');
      expect(state.subtasks[0].progress).toBe(50);
    });

    it('should handle error when getting status', async () => {
      const promise = firstValueFrom(service.getStatus());
      const req = httpMock.expectOne(`${baseUrl}/status`);
      req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });

      await expect(promise).rejects.toThrow();
    });
  });

  describe('startAgent', () => {
    it('should make POST request to /api/agent/start with request body', () => {
      const request: AgentStartRequest = {
        goal: 'Complete task A',
        autonomy_level: 'supervised',
      };

      service.startAgent(request.goal, request.autonomy_level).subscribe();

      const req = httpMock.expectOne(`${baseUrl}/start`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(request);

      req.flush(mockState);
    });

    it('should return AgentState after starting', async () => {
      const promise = firstValueFrom(service.startAgent('Test goal', 'semi-auto'));
      const req = httpMock.expectOne(`${baseUrl}/start`);
      req.flush(mockState);

      const state = await promise;
      expect(state.status).toBe('running');
      expect(state.current_goal).toBe('Test goal');
    });
  });

  describe('pauseAgent', () => {
    it('should make POST request to /api/agent/pause', () => {
      service.pauseAgent().subscribe();

      const req = httpMock.expectOne(`${baseUrl}/pause`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({});

      req.flush({ ...mockState, status: 'paused' });
    });

    it('should return AgentState with paused status', async () => {
      const promise = firstValueFrom(service.pauseAgent());
      const req = httpMock.expectOne(`${baseUrl}/pause`);
      req.flush({ ...mockState, status: 'paused' });

      const state = await promise;
      expect(state.status).toBe('paused');
    });
  });

  describe('resumeAgent', () => {
    it('should make POST request to /api/agent/resume', () => {
      service.resumeAgent().subscribe();

      const req = httpMock.expectOne(`${baseUrl}/resume`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({});

      req.flush(mockState);
    });

    it('should return AgentState with running status', async () => {
      const promise = firstValueFrom(service.resumeAgent());
      const req = httpMock.expectOne(`${baseUrl}/resume`);
      req.flush(mockState);

      const state = await promise;
      expect(state.status).toBe('running');
    });
  });

  describe('stopAgent', () => {
    it('should make POST request to /api/agent/stop', () => {
      service.stopAgent().subscribe();

      const req = httpMock.expectOne(`${baseUrl}/stop`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({});

      req.flush({ ...mockState, status: 'stopped', current_goal: null });
    });

    it('should return AgentState with stopped status', async () => {
      const promise = firstValueFrom(service.stopAgent());
      const req = httpMock.expectOne(`${baseUrl}/stop`);
      req.flush({ ...mockState, status: 'stopped', current_goal: null });

      const state = await promise;
      expect(state.status).toBe('stopped');
      expect(state.current_goal).toBeNull();
    });
  });

  describe('modifyGoal', () => {
    it('should make POST request to /api/agent/modify with request body', () => {
      const request: AgentModifyRequest = {
        goal: 'Updated goal',
      };

      service.modifyGoal(request.goal).subscribe();

      const req = httpMock.expectOne(`${baseUrl}/modify`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(request);

      req.flush({ ...mockState, current_goal: 'Updated goal' });
    });

    it('should return updated AgentState', async () => {
      const promise = firstValueFrom(service.modifyGoal('Modified goal'));
      const req = httpMock.expectOne(`${baseUrl}/modify`);
      req.flush({ ...mockState, current_goal: 'Modified goal' });

      const state = await promise;
      expect(state.current_goal).toBe('Modified goal');
    });
  });

  describe('getActionLog', () => {
    it('should make GET request to /api/agent/action-log', () => {
      service.getActionLog().subscribe();

      const req = httpMock.expectOne(`${baseUrl}/action-log`);
      expect(req.request.method).toBe('GET');

      req.flush({ actions: [], total_actions: 0 } as AgentActionLog);
    });

    it('should return AgentActionLog observable', async () => {
      const mockLog: AgentActionLog = {
        actions: [
          {
            action: 'start',
            timestamp: '2026-03-28T12:00:00Z',
            details: 'Agent started',
          },
          {
            action: 'step',
            timestamp: '2026-03-28T12:01:00Z',
            details: 'Processing step 1',
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
