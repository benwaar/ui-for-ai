/**
 * Data models for DMI (Decision Management Intelligence) Dashboard
 * Thursday: AI-Driven Reporting & Decision Support
 */

export interface DmiMetric {
  name: string;
  key: string;
  current: number;
  previous: number;
  unit: string;
  direction: 'higher_is_better' | 'lower_is_better';
  change_percent: number;
  trend: 'up' | 'down' | 'stable';
  status: 'healthy' | 'warning' | 'critical';
}

export interface DmiMetricsResponse {
  metrics: DmiMetric[];
  timestamp: string;
}

export interface DmiDecision {
  recommendation: 'deploy' | 'hold' | 'investigate' | 'rollback';
  confidence: number;
  reasoning: string;
  urgency: 'immediate' | 'within_hours' | 'within_days' | 'next_sprint';
  what_changed: string;
  why: {
    critical_issues: string[];
    warnings: string[];
    confidence_factors: string[];
  };
  impact: {
    risk_level: string;
    expected_outcome: string;
    rollback_plan?: string;
    next_steps?: string;
    required_actions?: string;
  };
  supporting_factors: {
    metric: string;
    value: string | number;
    status: string;
  }[];
  timestamp: string;
}

export interface DmiTrendPoint {
  date: string;
  value: number;
  is_anomaly: boolean;
}

export interface DmiTrendResponse {
  metric: string;
  unit: string;
  trend: DmiTrendPoint[];
  timestamp: string;
}

export interface DecisionLogEntry {
  timestamp: string;
  recommendation: 'deploy' | 'hold' | 'investigate' | 'rollback';
  confidence: number;
  actual_outcome: 'success' | 'correct' | 'partial' | 'incorrect';
  outcome_details: string;
  metrics_snapshot: {
    test_pass_rate: number;
    build_time: number;
    bug_count: number;
  };
}

export interface DecisionLogResponse {
  decisions: DecisionLogEntry[];
  summary: {
    total_decisions: number;
    correct_decisions: number;
    accuracy: number;
    avg_confidence: number;
  };
  timestamp: string;
}
