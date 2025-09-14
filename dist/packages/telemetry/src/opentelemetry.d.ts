/**
 * OpenTelemetry integration for distributed tracing and metrics
 */
import { TelemetryConfig, TraceSpan, MetricTags } from './types';
export declare class OpenTelemetryProvider {
    private config;
    private isInitialized;
    constructor(config?: TelemetryConfig['openTelemetry']);
    initialize(): Promise<void>;
    createSpan(operationName: string, tags?: MetricTags): TraceSpan;
    finishSpan(span: TraceSpan): void;
    recordMetric(name: string, value: number, tags?: MetricTags): void;
    private generateTraceId;
    private generateSpanId;
}
