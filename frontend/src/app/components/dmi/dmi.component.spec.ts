import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { DmiComponent } from './dmi.component';
import { DmiService } from '../../services/dmi.service';
import { ThemeService } from '../../services/theme.service';

describe('DmiComponent', () => {
  let component: DmiComponent;
  let fixture: ComponentFixture<DmiComponent>;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;
  let dmiServiceSpy: {
    getMetrics: ReturnType<typeof vi.fn>;
    getDecision: ReturnType<typeof vi.fn>;
    getDecisionLog: ReturnType<typeof vi.fn>;
    getTrend: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({} as CanvasRenderingContext2D);

    dmiServiceSpy = {
      getMetrics: vi.fn(),
      getDecision: vi.fn(),
      getDecisionLog: vi.fn(),
      getTrend: vi.fn(),
    };
    const themeServiceStub = {
      theme$: of<'colorful' | 'dark'>('colorful'),
      toggleTheme: vi.fn(),
      getCurrentTheme: vi.fn().mockReturnValue('colorful'),
    };

    await TestBed.configureTestingModule({
      imports: [DmiComponent],
      providers: [
        { provide: DmiService, useValue: dmiServiceSpy },
        { provide: ThemeService, useValue: themeServiceStub },
      ],
    }).compileComponents();
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
    vi.restoreAllMocks();
  });

  function createComponent(): void {
    fixture = TestBed.createComponent(DmiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('should create', () => {
    dmiServiceSpy.getMetrics.mockReturnValue(of({ metrics: [], timestamp: '2026-03-28T12:00:00Z' }));
    dmiServiceSpy.getDecision.mockReturnValue(throwError(() => new Error('decision not configured')));
    dmiServiceSpy.getDecisionLog.mockReturnValue(of({
      decisions: [],
      summary: {
        total_decisions: 0,
        correct_decisions: 0,
        accuracy: 0,
        avg_confidence: 0,
      },
      timestamp: '2026-03-28T12:00:00Z',
    }));

    createComponent();

    expect(component).toBeTruthy();
  });

  it('should show an error state when all dashboard requests fail', () => {
    dmiServiceSpy.getMetrics.mockReturnValue(throwError(() => new Error('metrics offline')));
    dmiServiceSpy.getDecision.mockReturnValue(throwError(() => new Error('decision offline')));
    dmiServiceSpy.getDecisionLog.mockReturnValue(throwError(() => new Error('decision log offline')));

    createComponent();

    expect(component.loading).toBe(false);
    expect(component.error).toBe('Unable to load dashboard data. Please try again.');
    expect(component.metrics).toEqual([]);
    expect(component.decision).toBeNull();
    expect(component.decisionLog).toEqual([]);

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Unable to load dashboard data. Please try again.');
  });

  it('should still render partial dashboard data when one request fails', () => {
    dmiServiceSpy.getMetrics.mockReturnValue(of({
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
    }));
    dmiServiceSpy.getDecision.mockReturnValue(throwError(() => new Error('decision offline')));
    dmiServiceSpy.getDecisionLog.mockReturnValue(of({
      decisions: [],
      summary: {
        total_decisions: 0,
        correct_decisions: 0,
        accuracy: 0,
        avg_confidence: 0,
      },
      timestamp: '2026-03-28T12:00:00Z',
    }));
    dmiServiceSpy.getTrend.mockReturnValue(of({
      metric: 'build_time',
      unit: 'min',
      trend: [
        { date: '2026-03-27', value: 3.8, is_anomaly: false },
        { date: '2026-03-28', value: 3.2, is_anomaly: false },
      ],
      timestamp: '2026-03-28T12:00:00Z',
    }));

    vi.useFakeTimers();
    try {
      createComponent();
      vi.advanceTimersByTime(1);
      fixture.detectChanges();
    } finally {
      vi.useRealTimers();
    }

    expect(component.loading).toBe(false);
    expect(component.error).toBeNull();
    expect(component.metrics.length).toBe(1);
    expect(component.decision).toBeNull();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Build Time');
  });
});
