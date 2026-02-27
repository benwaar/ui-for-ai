import { Component, OnInit, AfterViewInit, OnDestroy, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';
import { DmiService } from '../../services/dmi.service';
import { ThemeService } from '../../services/theme.service';
import {
  DmiMetric,
  DmiDecision,
  DecisionLogEntry,
  DmiTrendResponse,
  DecisionLogResponse
} from '../../models/dmi.model';
import { Observable } from 'rxjs';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

// Register Chart.js components
Chart.register(...registerables);

@Component({
  selector: 'app-dmi',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './dmi.component.html',
  styleUrls: ['./dmi.component.scss']
})
export class DmiComponent implements OnInit, AfterViewInit, OnDestroy {
  private dmiService = inject(DmiService);
  private cdr = inject(ChangeDetectorRef);
  public themeService = inject(ThemeService);

  // State
  metrics: DmiMetric[] = [];
  decision: DmiDecision | null = null;
  decisionLog: DecisionLogEntry[] = [];
  decisionLogSummary: DecisionLogResponse['summary'] | null = null;
  showAllDecisions = false;
  loading = true;
  error: string | null = null;

  // Charts
  private charts: Chart[] = [];
  theme$: Observable<'colorful' | 'dark'>;

  constructor() {
    this.theme$ = this.themeService.theme$;
  }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  ngAfterViewInit(): void {
    // Charts will be created after data loads
  }

  ngOnDestroy(): void {
    // Destroy all charts to prevent memory leaks
    this.charts.forEach(chart => chart.destroy());
    this.charts = [];
  }

  /**
   * Load all dashboard data
   */
  private loadDashboardData(): void {
    this.loading = true;
    this.error = null;

    // Load metrics
    this.dmiService.getMetrics().subscribe({
      next: (response) => {
        this.metrics = response.metrics;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load metrics:', err);
        this.error = 'Failed to load metrics';
      }
    });

    // Load decision
    this.dmiService.getDecision().subscribe({
      next: (decision) => {
        this.decision = decision;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load decision:', err);
        this.error = 'Failed to load decision';
      }
    });

    // Load decision log
    this.dmiService.getDecisionLog().subscribe({
      next: (response) => {
        this.decisionLog = response.decisions;
        this.decisionLogSummary = response.summary;
        this.loading = false;
        this.cdr.detectChanges();

        // Create charts after data is loaded
        this.createCharts();
      },
      error: (err) => {
        console.error('Failed to load decision log:', err);
        this.loading = false;
        this.error = 'Failed to load decision log';
      }
    });
  }

  /**
   * Create Chart.js charts for each metric
   */
  private createCharts(): void {
    const isDark = this.themeService.getCurrentTheme() === 'dark';
    const textColor = isDark ? '#e0e0e0' : '#333333';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

    this.metrics.forEach((metric) => {
      this.dmiService.getTrend(metric.key, 14).subscribe({
        next: (trendData) => {
          this.createMetricChart(metric, trendData, textColor, gridColor);
        },
        error: (err) => {
          console.error(`Failed to load trend for ${metric.key}:`, err);
        }
      });
    });
  }

  /**
   * Create a single metric chart
   */
  private createMetricChart(
    metric: DmiMetric,
    trendData: DmiTrendResponse,
    textColor: string,
    gridColor: string
  ): void {
    const canvasId = `chart-${metric.key}`;
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;

    if (!canvas) {
      console.warn(`Canvas not found for ${canvasId}`);
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const config: ChartConfiguration = {
      type: 'line',
      data: {
        labels: trendData.trend.map(point => {
          const date = new Date(point.date);
          return `${date.getMonth() + 1}/${date.getDate()}`;
        }),
        datasets: [{
          label: `${metric.name} (${metric.unit})`,
          data: trendData.trend.map(point => point.value),
          borderColor: this.getMetricColor(metric.status),
          backgroundColor: this.getMetricColor(metric.status, 0.1),
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointRadius: trendData.trend.map(point => point.is_anomaly ? 5 : 3),
          pointBackgroundColor: trendData.trend.map(point =>
            point.is_anomaly ? '#ff9800' : this.getMetricColor(metric.status)
          )
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            labels: {
              color: textColor
            }
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const value = context.parsed.y;
                const isAnomaly = trendData.trend[context.dataIndex].is_anomaly;
                const anomalyLabel = isAnomaly ? ' (Anomaly)' : '';
                return `${value} ${metric.unit}${anomalyLabel}`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              color: gridColor
            },
            ticks: {
              color: textColor
            }
          },
          y: {
            grid: {
              color: gridColor
            },
            ticks: {
              color: textColor
            }
          }
        }
      }
    };

    const chart = new Chart(ctx, config);
    this.charts.push(chart);
  }

  /**
   * Get color based on metric status
   */
  private getMetricColor(status: string, alpha = 1): string {
    const colors = {
      healthy: `rgba(76, 175, 80, ${alpha})`,
      warning: `rgba(255, 152, 0, ${alpha})`,
      critical: `rgba(244, 67, 54, ${alpha})`
    };
    return colors[status as keyof typeof colors] || colors.warning;
  }

  /**
   * Get Material icon for metric trend
   */
  getTrendIcon(trend: string): string {
    switch (trend) {
      case 'up':
        return 'trending_up';
      case 'down':
        return 'trending_down';
      case 'stable':
      default:
        return 'trending_flat';
    }
  }

  /**
   * Get icon for recommendation
   */
  getRecommendationIcon(recommendation: string): string {
    switch (recommendation) {
      case 'deploy':
        return 'rocket_launch';
      case 'hold':
        return 'pause_circle';
      case 'investigate':
        return 'search';
      case 'rollback':
        return 'undo';
      default:
        return 'help';
    }
  }

  /**
   * Get icon for outcome
   */
  getOutcomeIcon(outcome: string): string {
    switch (outcome) {
      case 'success':
        return 'check_circle';
      case 'correct':
        return 'verified';
      case 'partial':
        return 'warning';
      case 'incorrect':
        return 'error';
      default:
        return 'help';
    }
  }

  /**
   * Get confidence level as string
   */
  getConfidenceLevel(confidence: number): string {
    if (confidence >= 0.85) return 'High';
    if (confidence >= 0.7) return 'Medium';
    return 'Low';
  }

  /**
   * Get visible decision log entries
   */
  get visibleDecisions(): DecisionLogEntry[] {
    if (this.showAllDecisions) {
      return this.decisionLog;
    }
    return this.decisionLog.slice(0, 3);
  }

  /**
   * Toggle show all decisions
   */
  toggleShowAllDecisions(): void {
    this.showAllDecisions = !this.showAllDecisions;
  }

  /**
   * Toggle theme
   */
  toggleTheme(): void {
    this.themeService.toggleTheme();

    // Recreate charts with new theme colors
    this.charts.forEach(chart => chart.destroy());
    this.charts = [];
    this.createCharts();
  }

  /**
   * Format timestamp for display
   */
  formatTimestamp(timestamp: string): Date {
    return new Date(timestamp);
  }

  /**
   * Refresh dashboard data
   */
  refreshDashboard(): void {
    // Destroy existing charts
    this.charts.forEach(chart => chart.destroy());
    this.charts = [];

    // Reload all data
    this.loadDashboardData();
  }

  /**
   * Execute deployment action (simulation)
   */
  executeAction(action: string): void {
    const actionMessages: { [key: string]: string } = {
      deploy: 'Deployment initiated! In a real system, this would trigger your CI/CD pipeline.',
      hold: 'Deployment held. The release has been paused for review.',
      investigate: 'Investigation started. In a real system, this would create a task or alert the team.',
      rollback: 'Rollback initiated! In a real system, this would revert to the previous version.'
    };

    const message = actionMessages[action] || 'Action executed.';

    // In a real application, this would show a Material snackbar
    alert(`✓ ${message}\n\nThis is a simulation - no actual deployment occurred.`);
  }
}
