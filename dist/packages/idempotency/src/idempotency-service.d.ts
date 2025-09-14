/**
 * Idempotency service for ensuring safe request retries
 * Hash(method+path+body+org) → store lock + response for 24h
 */
import { IdempotencyKey, IdempotencyResponse, IdempotencyConfig } from './types';
export declare class IdempotencyService {
    private storage;
    private config;
    constructor(config?: Partial<IdempotencyConfig>);
    /**
     * Generate idempotency key from request parameters
     */
    generateKey(method: string, path: string, body: string, orgId: string): IdempotencyKey;
    /**
     * Check if request is idempotent and return cached response if available
     */
    checkIdempotency(key: IdempotencyKey): Promise<IdempotencyResponse | null>;
    /**
     * Store successful response for future idempotent requests
     */
    storeResponse(key: IdempotencyKey, response: IdempotencyResponse): Promise<void>;
    /**
     * Remove lock when request fails (allow retry)
     */
    releaseLock(key: IdempotencyKey): Promise<void>;
    /**
     * Create a lock for processing request
     */
    private createLock;
    /**
     * Clean up expired records (should be called periodically)
     */
    cleanup(): Promise<void>;
    /**
     * Get statistics about idempotency cache
     */
    getStats(): {
        totalKeys: number;
        lockedKeys: number;
        expiredKeys: number;
    };
}
