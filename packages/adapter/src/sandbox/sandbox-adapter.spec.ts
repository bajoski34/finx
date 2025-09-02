import { SandboxAdapter } from './sandbox-adapter';

describe('SandboxAdapter', () => {
  let adapter: SandboxAdapter;

  beforeEach(() => {
    adapter = new SandboxAdapter();
  });

  it('should be created with correct key', () => {
    expect(adapter.key).toBe('sandbox');
  });

  it('should return health status', async () => {
    const health = await adapter.health();
    
    expect(health.status).toBe('up');
    expect(health.latencyMs).toBeGreaterThan(0);
  });

  it('should return capabilities', async () => {
    const capabilities = await adapter.capabilities();
    
    expect(capabilities.rails).toContain('card');
    expect(capabilities.rails).toContain('bank_transfer');
    expect(capabilities.currencies).toContain('NGN');
    expect(capabilities.currencies).toContain('USD');
    expect(capabilities.features).toContain('3DS2');
  });

  it('should create payment intent', async () => {
    const paymentIntent = {
      amount: 10000,
      currency: 'NGN',
      description: 'Test payment'
    };

    const result = await adapter.createPaymentIntent(paymentIntent);
    
    expect(result.id).toMatch(/^sandbox_pi_/);
    expect(result.status).toBe('pending');
  });

  it('should fail payment intent for large amounts', async () => {
    const paymentIntent = {
      amount: 200000, // > 100000 should fail
      currency: 'NGN',
      description: 'Large payment'
    };

    const result = await adapter.createPaymentIntent(paymentIntent);
    
    expect(result.status).toBe('failed');
  });

  it('should verify webhooks as valid in sandbox mode', () => {
    const isValid = adapter.verifyWebhook('test-signature', 'test-payload');
    expect(isValid).toBe(true);
  });

  it('should map webhooks to core events', () => {
    const webhookEvent = {
      type: 'payment.succeeded',
      data: { payment_id: 'test_123' }
    };

    const coreEvent = adapter.mapWebhook(webhookEvent);
    
    expect(coreEvent.type).toBe('events.payment.succeeded');
    expect(coreEvent.data).toEqual(webhookEvent.data);
  });
});