export interface AgentState {
  status: 'idle' | 'running' | 'paused' | 'stopped';
  current_goal: string | null;
  autonomy_level?: 'supervised' | 'semi-auto' | 'full-auto';
  subtasks: AgentSubtask[];
  started_at?: string;
  action_log: AgentAction[];
}

export interface AgentSubtask {
  id: number;
  task: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  progress: number;
}

export interface AgentAction {
  timestamp: string;
  action: string;
  details: string;
}

export interface AgentStartRequest {
  goal: string;
  autonomy_level: 'supervised' | 'semi-auto' | 'full-auto';
}

export interface AgentModifyRequest {
  goal: string;
}

export interface AgentActionLog {
  actions: AgentAction[];
  total_actions: number;
}
