import {
  RailAdapter,
  RailCapabilities,
  PaymentIntent,
  ProviderIntentRef,
  RefundRef,
  PayoutRequest,
  PayoutRef,
  VARequest,
  VARef,
  CoreEvent
} from '@finx/core-domain';

/**
 * Sandbox rail adapter for testing and development
 * Provides mock implementations of all payment rails
 */
export class SandboxAdapter implements RailAdapter {
  key = 'sandbox';

  private mockDelay = 1000; // 1 second delay to simulate API calls.

  async health(): Promise<{ status: 'up' | 'down'; latencyMs: number }> {
    const start = Date.now();
    // Simulate network call.
    await new Promise(resolve => setTimeout(resolve, 100));
    return {
      status: 'up',
      latencyMs: Date.now() - start
    };
  }

  async capabilities(): Promise<RailCapabilities> {
    await this.delay();
    return {
      rails: ['card', 'bank_transfer', 'open_banking', 'mobile_money', 'wallet'],
      currencies: ['NGN', 'USD', 'GBP', 'EUR', 'KES', 'GHS'],
      countries: ['NG', 'US', 'GB', 'KE', 'GH'],
      features: ['3DS2', 'mandate', 'tokenization', 'payouts', 'refunds', 'webhooks']
    };
  }

  async createPaymentIntent(pi: PaymentIntent): Promise<ProviderIntentRef> {
    await this.delay();
    
    // Simulate different outcomes based on amount
    const shouldFail = pi.amount > 100000; // Fail if amount > 1000.00 (in minor units)
    
    return {
      id: `sandbox_pi_${Date.now()}`,
      providerId: `sandbox_${Math.random().toString(36).substr(2, 9)}`,
      status: shouldFail ? 'failed' : 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  async confirmPaymentIntent(id: string, data?: any): Promise<ProviderIntentRef> {
    await this.delay();
    
    // Simulate 3DS flow or OTP confirmation
    const shouldSucceed = Math.random() > 0.1; // 90% success rate
    
    return {
      id,
      providerId: `sandbox_${Math.random().toString(36).substr(2, 9)}`,
      status: shouldSucceed ? 'completed' : 'failed',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  async refund(paymentId: string, amountMinor?: number): Promise<RefundRef> {
    await this.delay();
    
    return {
      id: `sandbox_rf_${Date.now()}`,
      transactionId: paymentId,
      amount: amountMinor || 0
    };
  }

  async createPayout(tx: PayoutRequest): Promise<PayoutRef> {
    await this.delay();
    
    return {
      id: `sandbox_po_${Date.now()}`,
      transactionId: `sandbox_tx_${Math.random().toString(36).substr(2, 9)}`
    };
  }

  async getPayout(id: string): Promise<PayoutRef> {
    await this.delay();
    
    return {
      id,
      transactionId: `sandbox_tx_${Math.random().toString(36).substr(2, 9)}`
    };
  }

  async createVA(req: VARequest): Promise<VARef> {
    await this.delay();
    
    return {
      id: `sandbox_va_${Date.now()}`,
      virtualAccountId: `9${Math.random().toString().substr(2, 9)}`, // Nigerian bank format
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  async closeVA(id: string): Promise<void> {
    await this.delay();
    // Sandbox VA closed
  }

  verifyWebhook(sigHeader: string, payload: string): boolean {
    // In sandbox mode, all webhooks are considered valid
    return true;
  }

  mapWebhook(event: any): CoreEvent {
    // Map webhook events to core events
    const eventType = event.type || 'unknown';
    
    return {
      type: `events.${eventType}`,
      data: event.data || event
    };
  }

  /**
   * Simulate network delay for realistic testing
   */
  private async delay(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, this.mockDelay));
  }

  /**
   * Configure mock delay for testing
   */
  setMockDelay(ms: number): void {
    this.mockDelay = ms;
  }
}