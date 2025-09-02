/**
 * Idempotency types and interfaces
 */

export interface IdempotencyKey {
  key: string;
  method: string;
  path: string;
  body: string;
  orgId: string;
  hash: string;
  createdAt: string;
  expiresAt: string;
}

export interface IdempotencyResponse {
  statusCode: number;
  headers: Record<string, string>;
  body: any;
  createdAt: string;
}

export interface IdempotencyRecord {
  key: IdempotencyKey;
  response?: IdempotencyResponse;
  locked: boolean;
  lockExpiry?: string;
}

export interface IdempotencyConfig {
  defaultTtlSeconds: number;
  lockTimeoutSeconds: number;
  storage: {
    type: 'memory' | 'redis' | 'database';
    connection?: any;
  };
}