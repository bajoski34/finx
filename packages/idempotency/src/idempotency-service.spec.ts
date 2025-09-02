import { IdempotencyService } from './idempotency-service';

describe('IdempotencyService', () => {
  let service: IdempotencyService;

  beforeEach(() => {
    service = new IdempotencyService();
  });

  it('should generate idempotency key', () => {
    const key = service.generateKey('POST', '/api/v1/payments', '{"amount":1000}', 'org_123');
    
    expect(key.key).toMatch(/^idem_/);
    expect(key.method).toBe('POST');
    expect(key.path).toBe('/api/v1/payments');
    expect(key.orgId).toBe('org_123');
    expect(key.hash).toBeDefined();
  });

  it('should return null for first-time request', async () => {
    const key = service.generateKey('POST', '/api/v1/payments', '{"amount":1000}', 'org_123');
    
    const result = await service.checkIdempotency(key);
    
    expect(result).toBeNull();
  });

  it('should throw error for locked request', async () => {
    const key = service.generateKey('POST', '/api/v1/payments', '{"amount":1000}', 'org_123');
    
    // First request creates lock
    await service.checkIdempotency(key);
    
    // Second request should throw
    await expect(service.checkIdempotency(key))
      .rejects.toThrow('Request is currently being processed');
  });

  it('should store and return cached response', async () => {
    const key = service.generateKey('POST', '/api/v1/payments', '{"amount":1000}', 'org_123');
    
    // First request
    await service.checkIdempotency(key);
    
    const response = {
      statusCode: 201,
      headers: { 'content-type': 'application/json' },
      body: { id: 'payment_123', status: 'created' },
      createdAt: new Date().toISOString()
    };
    
    // Store response
    await service.storeResponse(key, response);
    
    // Second identical request should return cached response
    const cachedResponse = await service.checkIdempotency(key);
    
    expect(cachedResponse).toEqual(response);
  });

  it('should track statistics correctly', async () => {
    const key1 = service.generateKey('POST', '/api/v1/payments', '{"amount":1000}', 'org_123');
    const key2 = service.generateKey('GET', '/api/v1/payments/123', '', 'org_123');
    
    await service.checkIdempotency(key1);
    await service.checkIdempotency(key2);
    
    const stats = service.getStats();
    
    expect(stats.totalKeys).toBe(2);
    expect(stats.lockedKeys).toBe(2);
  });
});