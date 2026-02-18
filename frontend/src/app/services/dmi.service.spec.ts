import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { DmiService } from './dmi.service';
import { DmiMetrics, TrendData, DecisionSummary } from '../models/dmi.model';
import { firstValueFrom } from 'rxjs';

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

      req.flush({} as DmiMetrics);
    });

    it('should return DmiMetrics observable', async () => {
      const mockMetrics: DmiMetrics = {
        total_decisions: 150,
        confident_decisions: 120,
        uncertain_decisions: 20,
        failed_decisions: 10,
        average_confidence: 0.85,
        success_rate: 0.93,
        timestamp: '2024-01-01T12:00:00Z',
      };

      const promise = firstValueFrom(service.getMetrics());
      const req = httpMock.expectOne(`${baseUrl}/metrics`);
      req.flush(mockMetrics);

      const metrics = await promise;
      expect(metrics).toEqual(mockMetrics);
      expect(metrics.total_decisions).toBe(150);
      expect(metrics.average_confidence).toBe(0.85);
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
      service.getTrend().subscribe();

      const req = httpMock.expectOne(`${baseUrl}/trend?days=7`);
      expect(req.request.method).toBe('GET');

      req.flush({} as TrendData);
    });

    it('should make GET request with custom days parameter', () => {
      service.getTrend(30).subscribe();

      const req = httpMock.expectOne(`${baseUrl}/trend?days=30`);
      expect(req.request.method).toBe('GET');

      req.flush({} as TrendData);
    });

    it('should return TrendData observable', async () => {
      const mockTrend: TrendData = {
        data_points: [
          {
            date: '2024-01-01',
            confidence: 0.85,
            decision_count: 20,
          },
          {
            date: '2024-01-02',
            confidence: 0.87,
            decision_count: 25,
          },
          {
            date: '2024-01-03',
            confidence: 0.83,
            decision_count: 18,
          },
        ],
        trend_direction: 'stable',
        period_days: 7,
      };

      const promise = firstValueFrom(service.getTrend(7));
      const req = httpMock.expectOne(`${baseUrl}/trend?days=7`);
      req.flush(mockTrend);

      const trend = await promise;
      expect(trend).toEqual(mockTrend);
      expect(trend.data_points.length).toBe(3);
      expect(trend.trend_direction).toBe('stable');
      expect(trend.period_days).toBe(7);
    });

    it('should handle empty trend data', async () => {
      const emptyTrend: TrendData = {
        data_points: [],
        trend_direction: 'unknown',
        period_days: 7,
      };

      const promise = firstValueFrom(service.getTrend());
      const req = httpMock.expectOne(`${baseUrl}/trend?days=7`);
      req.flush(emptyTrend);

      const trend = await promise;
      expect(trend.data_points.length).toBe(0);
      expect(trend.trend_direction).toBe('unknown');
    });

    it('should handle error when getting trend', async () => {
      const promise = firstValueFrom(service.getTrend(14));
      const req = httpMock.expectOne(`${baseUrl}/trend?days=14`);
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });

      await expect(promise).rejects.toThrow();
    });
  });

  describe('getDecisionSummary', () => {
    it('should make GET request to /api/dmi/decision', () => {
      service.getDecisionSummary().subscribe();

      const req = httpMock.expectOne(`${baseUrl}/decision`);
      expect(req.request.method).toBe('GET');

      req.flush({} as DecisionSummary);
    });

    it('should return DecisionSummary observable', async () => {
      const mockSummary: DecisionSummary = {
        recent_decisions: [
          {
            decision_id: 'dec-001',
            query: 'What is the capital of France?',
            confidence: 0.98,
            outcome: 'success',
            timestamp: '2024-01-01T12:00:00Z',
          },
          {
            decision_id: 'dec-002',
            query: 'Complex ambiguous question?',
            confidence: 0.45,
            outcome: 'uncertain',
            timestamp: '2024-01-01T12:05:00Z',
          },
        ],
        total_recent: 2,
        overall_quality_score: 0.88,
      };

      const promise = firstValueFrom(service.getDecisionSummary());
      const req = httpMock.expectOne(`${baseUrl}/decision`);
      req.flush(mockSummary);

      const summary = await promise;
      expect(summary).toEqual(mockSummary);
      expect(summary.recent_decisions.length).toBe(2);
      expect(summary.overall_quality_score).toBe(0.88);
    });

    it('should handle empty decision summary', async () => {
      const emptySummary: DecisionSummary = {
        recent_decisions: [],
        total_recent: 0,
        overall_quality_score: 0,
      };

      const promise = firstValueFrom(service.getDecisionSummary());
      const req = httpMock.expectOne(`${baseUrl}/decision`);
      req.flush(emptySummary);

      const summary = await promise;
      expect(summary.recent_decisions.length).toBe(0);
      expect(summary.total_recent).toBe(0);
    });

    it('should handle error when getting decision summary', async () => {
      const promise = firstValueFrom(service.getDecisionSummary());
      const req = httpMock.expectOne(`${baseUrl}/decision`);
      req.flush('Service Unavailable', { status: 503, statusText: 'Service Unavailable' });

      await expect(promise).rejects.toThrow();
    });

    it('should handle network timeout', async () => {
      const promise = firstValueFrom(service.getDecisionSummary());
      const req = httpMock.expectOne(`${baseUrl}/decision`);
      req.error(new ProgressEvent('error'));

      await expect(promise).rejects.toThrow();
    });
  });
});
