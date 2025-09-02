/**
 * Telemetry types for metrics, traces, and analytics
 */

export interface TelemetryEvent {
  event: string;
  userId?: string;
  merchantId?: string;
  orgId?: string;
  data?: Record<string, any>;
  timestamp: string;
}

export interface MetricTags {
  org_id?: string;
  rail?: string;
  country?: string;
  currency?: string;
  [key: string]: string | undefined;
}

export interface TraceSpan {
  traceId: string;
  spanId: string;
  operationName: string;
  tags: MetricTags;
  startTime: number;
  duration: number;
}

export interface BusinessMetrics {
  // Success rates
  acceptance_rate: number;
  success_rate: number;
  conversion_rate: number;
  
  // Financial
  revenue: number;
  cost_per_transaction: number;
  time_to_settlement: number;
  
  // Reconciliation
  break_rate: number;
  
  // API usage
  api_calls_per_feature: Record<string, number>;
  error_rate: number;
}

export interface TelemetryConfig {
  openTelemetry?: {
    endpoint?: string;
    headers?: Record<string, string>;
  };
  mixpanel?: {
    projectToken?: string;
    apiSecret?: string;
  };
  business?: {
    enabled: boolean;
    flushInterval: number;
  };
}