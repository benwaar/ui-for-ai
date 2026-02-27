import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  DmiMetricsResponse,
  DmiDecision,
  DmiTrendResponse,
  DecisionLogResponse
} from '../models/dmi.model';

@Injectable({
  providedIn: 'root'
})
export class DmiService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:5000/api/dmi';

  /**
   * Get current software project health metrics
   */
  getMetrics(): Observable<DmiMetricsResponse> {
    return this.http.get<DmiMetricsResponse>(`${this.API_URL}/metrics`);
  }

  /**
   * Get AI-driven deployment decision with reasoning
   */
  getDecision(): Observable<DmiDecision> {
    return this.http.get<DmiDecision>(`${this.API_URL}/decision`);
  }

  /**
   * Get historical trend data for a specific metric
   * @param metric - Metric key (build_time, test_pass_rate, etc.)
   * @param days - Number of days of history (default: 14)
   */
  getTrend(metric: string, days = 14): Observable<DmiTrendResponse> {
    return this.http.get<DmiTrendResponse>(`${this.API_URL}/trend?metric=${metric}&days=${days}`);
  }

  /**
   * Get historical decision log with outcomes
   */
  getDecisionLog(): Observable<DecisionLogResponse> {
    return this.http.get<DecisionLogResponse>(`${this.API_URL}/decision-log`);
  }
}
