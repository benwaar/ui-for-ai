import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  AgentState,
  AgentStartRequest,
  AgentModifyRequest,
  AgentActionLog
} from '../models/agent.model';

@Injectable({
  providedIn: 'root'
})
export class AgentService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5000/api/agent';

  getStatus(): Observable<AgentState> {
    return this.http.get<AgentState>(`${this.apiUrl}/status`);
  }

  start(request: AgentStartRequest): Observable<AgentState> {
    return this.http.post<AgentState>(`${this.apiUrl}/start`, request);
  }

  pause(): Observable<AgentState> {
    return this.http.post<AgentState>(`${this.apiUrl}/pause`, {});
  }

  resume(): Observable<AgentState> {
    return this.http.post<AgentState>(`${this.apiUrl}/resume`, {});
  }

  stop(): Observable<AgentState> {
    return this.http.post<AgentState>(`${this.apiUrl}/stop`, {});
  }

  modify(request: AgentModifyRequest): Observable<AgentState> {
    return this.http.post<AgentState>(`${this.apiUrl}/modify`, request);
  }

  getActionLog(): Observable<AgentActionLog> {
    return this.http.get<AgentActionLog>(`${this.apiUrl}/action-log`);
  }
}
