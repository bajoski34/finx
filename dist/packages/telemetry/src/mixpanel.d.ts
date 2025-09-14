/**
 * Mixpanel integration for business analytics and product insights
 */
import { TelemetryEvent, TelemetryConfig, BusinessMetrics } from './types';
export declare class MixpanelProvider {
    private config;
    private isInitialized;
    constructor(config?: TelemetryConfig['mixpanel']);
    initialize(): Promise<void>;
    trackEvent(event: TelemetryEvent): void;
    trackBusinessMetrics(metrics: Partial<BusinessMetrics>, tags?: Record<string, string>): void;
    setUserProfile(userId: string, properties: Record<string, any>): void;
    alias(distinctId: string, alias: string): void;
}
