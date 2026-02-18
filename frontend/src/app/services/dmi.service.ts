import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  DmiMetrics,
  TrendData,
  DecisionSummary
} from '../models/dmi.model';

@Injectable({
  providedIn: 'root'
})
export class DmiService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5000/api/dmi';

  getMetrics(): Observable<DmiMetrics> {
    return this.http.get<DmiMetrics>(`${this.apiUrl}/metrics`);
  }

  getTrend(days = 7): Observable<TrendData> {
    return this.http.get<TrendData>(`${this.apiUrl}/trend?days=${days}`);
  }

  getDecisionSummary(): Observable<DecisionSummary> {
    return this.http.get<DecisionSummary>(`${this.apiUrl}/decision`);
  }
}
