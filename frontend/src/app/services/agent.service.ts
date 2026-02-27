import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AgentState, AgentStartRequest, AgentModifyRequest, AgentActionLog } from '../models/agent.model';

@Injectable({
  providedIn: 'root'
})
export class AgentService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:5000/api/agent';

  /**
   * Get current agent status including subtasks and action log
   */
  getStatus(): Observable<AgentState> {
    return this.http.get<AgentState>(`${this.API_URL}/status`);
  }

  /**
   * Start agent with a goal and autonomy level
   * @param goal - The goal for the agent to achieve
   * @param autonomyLevel - Level of autonomy (supervised, semi-auto, full-auto)
   */
  startAgent(goal: string, autonomyLevel: 'supervised' | 'semi-auto' | 'full-auto'): Observable<AgentState> {
    const request: AgentStartRequest = {
      goal,
      autonomy_level: autonomyLevel
    };
    return this.http.post<AgentState>(`${this.API_URL}/start`, request);
  }

  /**
   * Pause the currently running agent
   */
  pauseAgent(): Observable<AgentState> {
    return this.http.post<AgentState>(`${this.API_URL}/pause`, {});
  }

  /**
   * Resume a paused agent
   */
  resumeAgent(): Observable<AgentState> {
    return this.http.post<AgentState>(`${this.API_URL}/resume`, {});
  }

  /**
   * Stop the agent completely (kill switch)
   */
  stopAgent(): Observable<AgentState> {
    return this.http.post<AgentState>(`${this.API_URL}/stop`, {});
  }

  /**
   * Modify the agent's goal mid-execution
   * @param goal - New goal for the agent
   */
  modifyGoal(goal: string): Observable<AgentState> {
    const request: AgentModifyRequest = { goal };
    return this.http.post<AgentState>(`${this.API_URL}/modify`, request);
  }

  /**
   * Get detailed action log for explainability
   */
  getActionLog(): Observable<AgentActionLog> {
    return this.http.get<AgentActionLog>(`${this.API_URL}/action-log`);
  }
}
