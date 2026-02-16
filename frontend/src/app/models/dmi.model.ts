export interface DmiMetrics {
  primary_metric: PrimaryMetric;
  ai_insight: AiInsight;
  recommendation: Recommendation;
  supporting_metrics: SupportingMetric[];
  timestamp: string;
}

export interface PrimaryMetric {
  name: string;
  current_value: number;
  previous_value: number;
  change_percent: number;
  trend: 'up' | 'down';
  unit: string;
}

export interface AiInsight {
  summary: string;
  confidence: number;
  reasoning: string[];
}

export interface Recommendation {
  action: string;
  priority: 'low' | 'medium' | 'high';
  confidence: number;
}

export interface SupportingMetric {
  name: string;
  value: number;
  change: number;
  unit?: string;
}

export interface TrendData {
  trend: TrendPoint[];
  prediction: Prediction;
}

export interface TrendPoint {
  date: string;
  value: number;
  confidence_interval: {
    lower: number;
    upper: number;
  };
}

export interface Prediction {
  next_value: number;
  confidence: number;
  note: string;
}

export interface DecisionSummary {
  what_changed: string;
  why: {
    primary_factors: string[];
    confidence: number;
    data_quality: string;
  };
  what_next: {
    immediate_actions: ImmediateAction[];
    monitoring_focus: string[];
  };
  timestamp: string;
}

export interface ImmediateAction {
  action: string;
  expected_impact: string;
  confidence: number;
  risk: 'low' | 'medium' | 'high';
}
