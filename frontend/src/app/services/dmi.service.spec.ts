import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { DmiService } from './dmi.service';
import {
  DecisionLogResponse,
  DmiDecision,
  DmiMetricsResponse,
  DmiTrendResponse,
} from '../models/dmi.model';

describe('DmiService', () => {
  let service: DmiService;
  let httpMock: HttpTestingController;

  const baseUrl = 'http://localhost:5000/api/dmi';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DmiService, provideHttpClient(), provideHttpClientTesting()],
    });
    httpMock = TestBed.inject(HttpTestingController);
    service = TestBed.inject(DmiService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getMetrics', () => {
    it('should make GET request to /api/dmi/metrics', () => {
      service.getMetrics().subscribe();

      const req = httpMock.expectOne(`${baseUrl}/metrics`);
      expect(req.request.method).toBe('GET');

      req.flush({} as DmiMetricsResponse);
    });

    it('should return DmiMetricsResponse observable', async () => {
      const mockMetrics: DmiMetricsResponse = {
        metrics: [
          {
            name: 'Build Time',
            key: 'build_time',
            current: 3.2,
            previous: 3.8,
            unit: 'min',
            direction: 'lower_is_better',
            change_percent: -15.8,
            trend: 'down',
            status: 'healthy',
          },
        ],
        timestamp: '2026-03-28T12:00:00Z',
      };

      const promise = firstValueFrom(service.getMetrics());
      const req = httpMock.expectOne(`${baseUrl}/metrics`);
      req.flush(mockMetrics);

      const metrics = await promise;
      expect(metrics).toEqual(mockMetrics);
      expect(metrics.metrics.length).toBe(1);
      expect(metrics.metrics[0].key).toBe('build_time');
    });

    it('should handle error when getting metrics', async () => {
      const promise = firstValueFrom(service.getMetrics());
      const req = httpMock.expectOne(`${baseUrl}/metrics`);
      req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });

      await expect(promise).rejects.toThrow();
    });
  });

  describe('getTrend', () => {
    it('should make GET request to /api/dmi/trend with default days parameter', () => {
      service.getTrend('build_time').subscribe();

      const req = httpMock.expectOne(`${baseUrl}/trend?metric=build_time&days=14`);
      expect(req.request.method).toBe('GET');

      req.flush({} as DmiTrendResponse);
    });

    it('should make GET request with custom days parameter', () => {
      service.getTrend('build_time', 30).subscribe();

      const req = httpMock.expectOne(`${baseUrl}/trend?metric=build_time&days=30`);
      expect(req.request.method).toBe('GET');

      req.flush({} as DmiTrendResponse);
    });

    it('should return DmiTrendResponse observable', async () => {
      const mockTrend: DmiTrendResponse = {
        metric: 'build_time',
        unit: 'min',
        trend: [
          {
            date: '2026-03-26',
            value: 4.1,
            is_anomaly: false,
          },
          {
            date: '2026-03-27',
            value: 3.8,
            is_anomaly: false,
          },
          {
            date: '2026-03-28',
            value: 3.2,
            is_anomaly: true,
          },
        ],
        timestamp: '2026-03-28T12:00:00Z',
      };

      const promise = firstValueFrom(service.getTrend('build_time', 14));
      const req = httpMock.expectOne(`${baseUrl}/trend?metric=build_time&days=14`);
      req.flush(mockTrend);

      const trend = await promise;
      expect(trend).toEqual(mockTrend);
      expect(trend.trend.length).toBe(3);
      expect(trend.metric).toBe('build_time');
      expect(trend.trend[2].is_anomaly).toBe(true);
    });

    it('should handle empty trend data', async () => {
      const emptyTrend: DmiTrendResponse = {
        metric: 'build_time',
        unit: 'min',
        trend: [],
        timestamp: '2026-03-28T12:00:00Z',
      };

      const promise = firstValueFrom(service.getTrend('build_time'));
      const req = httpMock.expectOne(`${baseUrl}/trend?metric=build_time&days=14`);
      req.flush(emptyTrend);

      const trend = await promise;
      expect(trend.trend.length).toBe(0);
      expect(trend.metric).toBe('build_time');
    });

    it('should handle error when getting trend', async () => {
      const promise = firstValueFrom(service.getTrend('build_time', 14));
      const req = httpMock.expectOne(`${baseUrl}/trend?metric=build_time&days=14`);
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });

      await expect(promise).rejects.toThrow();
    });
  });

  describe('getDecision', () => {
    it('should make GET request to /api/dmi/decision', () => {
      service.getDecision().subscribe();

      const req = httpMock.expectOne(`${baseUrl}/decision`);
      expect(req.request.method).toBe('GET');

      req.flush({} as DmiDecision);
    });

    it('should return DmiDecision observable', async () => {
      const mockDecision: DmiDecision = {
        recommendation: 'deploy',
        confidence: 0.92,
        reasoning: 'All metrics within healthy ranges',
        urgency: 'immediate',
        what_changed: 'Build performance optimized',
        why: {
          critical_issues: [],
          warnings: [],
          confidence_factors: ['Strong test pass rate (96.2%)'],
        },
        impact: {
          risk_level: 'low',
          expected_outcome: 'Smooth deployment with minimal user impact',
          rollback_plan: 'Automated rollback available within 5 minutes',
        },
        supporting_factors: [
          {
            metric: 'Test Pass Rate',
            value: '96.2%',
            status: 'healthy',
          },
        ],
        timestamp: '2026-03-28T12:00:00Z',
      };

      const promise = firstValueFrom(service.getDecision());
      const req = httpMock.expectOne(`${baseUrl}/decision`);
      req.flush(mockDecision);

      const decision = await promise;
      expect(decision).toEqual(mockDecision);
      expect(decision.recommendation).toBe('deploy');
      expect(decision.confidence).toBe(0.92);
    });

    it('should handle error when getting decision', async () => {
      const promise = firstValueFrom(service.getDecision());
      const req = httpMock.expectOne(`${baseUrl}/decision`);
      req.flush('Service Unavailable', { status: 503, statusText: 'Service Unavailable' });

      await expect(promise).rejects.toThrow();
    });
  });

  describe('getDecisionLog', () => {
    it('should make GET request to /api/dmi/decision-log', () => {
      service.getDecisionLog().subscribe();

      const req = httpMock.expectOne(`${baseUrl}/decision-log`);
      expect(req.request.method).toBe('GET');

      req.flush({} as DecisionLogResponse);
    });

    it('should return DecisionLogResponse observable', async () => {
      const mockLog: DecisionLogResponse = {
        decisions: [
          {
            timestamp: '2026-03-28T12:00:00Z',
            recommendation: 'deploy',
            confidence: 0.89,
            actual_outcome: 'success',
            outcome_details: 'Deployment completed successfully.',
            metrics_snapshot: {
              test_pass_rate: 94.5,
              build_time: 3.2,
              bug_count: 8,
            },
          },
        ],
        summary: {
          total_decisions: 1,
          correct_decisions: 1,
          accuracy: 100,
          avg_confidence: 0.89,
        },
        timestamp: '2026-03-28T12:00:00Z',
      };

      const promise = firstValueFrom(service.getDecisionLog());
      const req = httpMock.expectOne(`${baseUrl}/decision-log`);
      req.flush(mockLog);

      const log = await promise;
      expect(log).toEqual(mockLog);
      expect(log.decisions.length).toBe(1);
      expect(log.summary.accuracy).toBe(100);
    });

    it('should handle error when getting decision log', async () => {
      const promise = firstValueFrom(service.getDecisionLog());
      const req = httpMock.expectOne(`${baseUrl}/decision-log`);
      req.error(new ProgressEvent('error'));

      await expect(promise).rejects.toThrow();
    });
  });
});
