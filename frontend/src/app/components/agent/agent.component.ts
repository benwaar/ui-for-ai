import { Component, OnInit, OnDestroy, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../../material.module';
import { AgentService } from '../../services/agent.service';
import { ThemeService } from '../../services/theme.service';
import { AgentState, AgentSubtask, AgentAction } from '../../models/agent.model';
import { Observable, Subscription, interval } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-agent',
  standalone: true,
  imports: [CommonModule, FormsModule, MaterialModule],
  templateUrl: './agent.component.html',
  styleUrls: ['./agent.component.scss']
})
export class AgentComponent implements OnInit, OnDestroy {
  private agentService = inject(AgentService);
  private cdr = inject(ChangeDetectorRef);
  public themeService = inject(ThemeService);

  // Agent state
  agentState: AgentState = {
    status: 'idle',
    current_goal: null,
    subtasks: [],
    action_log: []
  };

  // Form inputs
  goalInput = '';
  autonomyLevel: 'supervised' | 'semi-auto' | 'full-auto' = 'supervised';

  // UI state
  showAllActions = false;
  isModifyingGoal = false;
  modifiedGoalInput = '';
  statusPolling?: Subscription;
  theme$: Observable<'colorful' | 'dark'>;

  constructor() {
    this.theme$ = this.themeService.theme$;
  }

  ngOnInit(): void {
    this.loadAgentStatus();
  }

  ngOnDestroy(): void {
    this.stopPolling();
  }

  /**
   * Load initial agent status
   */
  loadAgentStatus(): void {
    this.agentService.getStatus().subscribe({
      next: (state) => {
        this.agentState = state;
        this.cdr.detectChanges();
        
        // Resume polling if agent is running
        if (state.status === 'running') {
          this.startStatusPolling();
        }
      },
      error: (error) => {
        console.error('Failed to load agent status:', error);
      }
    });
  }

  /**
   * Start the agent with the specified goal and autonomy level
   */
  startAgent(): void {
    if (!this.goalInput.trim()) {
      return;
    }

    this.agentService.startAgent(this.goalInput, this.autonomyLevel).subscribe({
      next: (state) => {
        this.agentState = state;
        this.cdr.detectChanges();
        this.startStatusPolling();
      },
      error: (error) => {
        console.error('Failed to start agent:', error);
      }
    });
  }

  /**
   * Pause the currently running agent
   */
  pauseAgent(): void {
    this.agentService.pauseAgent().subscribe({
      next: (state) => {
        this.agentState = state;
        this.cdr.detectChanges();
        this.stopPolling();
      },
      error: (error) => {
        console.error('Failed to pause agent:', error);
      }
    });
  }

  /**
   * Resume a paused agent
   */
  resumeAgent(): void {
    this.agentService.resumeAgent().subscribe({
      next: (state) => {
        this.agentState = state;
        this.cdr.detectChanges();
        this.startStatusPolling();
      },
      error: (error) => {
        console.error('Failed to resume agent:', error);
      }
    });
  }

  /**
   * Stop the agent (kill switch)
   */
  stopAgent(): void {
    this.agentService.stopAgent().subscribe({
      next: (state) => {
        this.agentState = state;
        this.cdr.detectChanges();
        this.stopPolling();
      },
      error: (error) => {
        console.error('Failed to stop agent:', error);
      }
    });
  }

  /**
   * Show inline form to modify the goal
   */
  showModifyGoalForm(): void {
    this.isModifyingGoal = true;
    this.modifiedGoalInput = this.agentState.current_goal || '';
  }

  /**
   * Cancel goal modification
   */
  cancelModifyGoal(): void {
    this.isModifyingGoal = false;
    this.modifiedGoalInput = '';
  }

  /**
   * Submit the modified goal
   */
  submitModifiedGoal(): void {
    if (!this.modifiedGoalInput.trim()) {
      return;
    }

    this.agentService.modifyGoal(this.modifiedGoalInput).subscribe({
      next: (state) => {
        this.agentState = state;
        this.isModifyingGoal = false;
        this.modifiedGoalInput = '';
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Failed to modify goal:', error);
      }
    });
  }

  /**
   * Start polling for status updates (every 2 seconds)
   */
  private startStatusPolling(): void {
    this.stopPolling(); // Ensure no duplicate polling
    
    this.statusPolling = interval(2000)
      .pipe(
        switchMap(() => this.agentService.getStatus())
      )
      .subscribe({
        next: (state) => {
          this.agentState = state;
          this.cdr.detectChanges();
          
          // Stop polling if agent is no longer running
          if (state.status !== 'running') {
            this.stopPolling();
          }
        },
        error: (error) => {
          console.error('Status polling error:', error);
        }
      });
  }

  /**
   * Stop status polling
   */
  private stopPolling(): void {
    if (this.statusPolling) {
      this.statusPolling.unsubscribe();
      this.statusPolling = undefined;
    }
  }

  /**
   * Toggle theme between colorful and dark
   */
  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  /**
   * Get Material icon based on agent status
   */
  getStatusIcon(status: string): string {
    switch (status) {
      case 'running':
        return 'play_circle';
      case 'paused':
        return 'pause_circle';
      case 'stopped':
        return 'stop_circle';
      case 'idle':
      default:
        return 'radio_button_unchecked';
    }
  }

  /**
   * Get Material icon based on subtask status
   */
  getSubtaskIcon(status: string): string {
    switch (status) {
      case 'completed':
        return 'check_circle';
      case 'in_progress':
        return 'pending';
      case 'failed':
        return 'error';
      case 'pending':
      default:
        return 'radio_button_unchecked';
    }
  }

  /**
   * Get Material color based on subtask status
   */
  getSubtaskColor(status: string): 'primary' | 'accent' | 'warn' | undefined {
    switch (status) {
      case 'completed':
        return 'primary';
      case 'in_progress':
        return 'accent';
      case 'failed':
        return 'warn';
      default:
        return undefined;
    }
  }

  /**
   * Get CSS class for autonomy level
   */
  getAutonomyClass(): string {
    return `autonomy-${this.agentState.autonomy_level || 'supervised'}`;
  }

  /**
   * Get display label for autonomy level
   */
  getAutonomyLabel(level?: string): string {
    switch (level) {
      case 'supervised':
        return 'Supervised';
      case 'semi-auto':
        return 'Semi-Auto';
      case 'full-auto':
        return 'Full-Auto';
      default:
        return 'Not Set';
    }
  }

  /**
   * Count completed subtasks
   */
  get completedSubtasks(): number {
    return this.agentState.subtasks.filter(t => t.status === 'completed').length;
  }

  /**
   * Get visible actions (last 10 or all if expanded)
   */
  get visibleActions(): AgentAction[] {
    const actions = this.agentState.action_log || [];
    if (this.showAllActions) {
      return actions;
    }
    return actions.slice(-10).reverse();
  }

  /**
   * Check if there are more than 10 actions
   */
  get hasMoreActions(): boolean {
    return (this.agentState.action_log || []).length > 10;
  }

  /**
   * Toggle showing all actions
   */
  toggleShowAllActions(): void {
    this.showAllActions = !this.showAllActions;
  }

  /**
   * Format timestamp for display
   */
  formatTimestamp(timestamp: string): Date {
    return new Date(timestamp);
  }
}
