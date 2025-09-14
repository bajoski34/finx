/**
 * Idempotency service for ensuring safe request retries
 * Hash(method+path+body+org) → store lock + response for 24h
 */
import * as crypto from "node:crypto";
export class IdempotencyService {
    storage = new Map();
    config;
    constructor(config = {}) {
        this.config = {
            defaultTtlSeconds: 24 * 60 * 60, // 24 hours
            lockTimeoutSeconds: 30, // 30 seconds
            storage: { type: 'memory' },
            ...config
        };
    }
    /**
     * Generate idempotency key from request parameters
     */
    generateKey(method, path, body, orgId) {
        const content = `${method}:${path}:${body}:${orgId}`;
        const hash = crypto.createHash('sha256').update(content).digest('hex');
        const now = new Date();
        const expiresAt = new Date(now.getTime() + this.config.defaultTtlSeconds * 1000);
        return {
            key: `idem_${hash}`,
            method,
            path,
            body,
            orgId,
            hash,
            createdAt: now.toISOString(),
            expiresAt: expiresAt.toISOString()
        };
    }
    /**
     * Check if request is idempotent and return cached response if available
     */
    async checkIdempotency(key) {
        const record = this.storage.get(key.key);
        if (!record) {
            // First time seeing this request
            await this.createLock(key);
            return null;
        }
        // Check if record has expired
        if (new Date() > new Date(key.expiresAt)) {
            this.storage.delete(key.key);
            await this.createLock(key);
            return null;
        }
        // Check if request is still being processed (locked)
        if (record.locked) {
            const lockExpiry = record.lockExpiry ? new Date(record.lockExpiry) : null;
            if (lockExpiry && new Date() > lockExpiry) {
                // Lock has expired, allow retry
                await this.createLock(key);
                return null;
            }
            // Still locked, return 409 Conflict
            throw new Error('Request is currently being processed');
        }
        // Return cached response
        return record.response || null;
    }
    /**
     * Store successful response for future idempotent requests
     */
    async storeResponse(key, response) {
        const record = this.storage.get(key.key);
        if (record) {
            record.response = response;
            record.locked = false;
            record.lockExpiry = undefined;
        }
    }
    /**
     * Remove lock when request fails (allow retry)
     */
    async releaseLock(key) {
        const record = this.storage.get(key.key);
        if (record) {
            record.locked = false;
            record.lockExpiry = undefined;
        }
    }
    /**
     * Create a lock for processing request
     */
    async createLock(key) {
        const lockExpiry = new Date(Date.now() + this.config.lockTimeoutSeconds * 1000);
        const record = {
            key,
            locked: true,
            lockExpiry: lockExpiry.toISOString()
        };
        this.storage.set(key.key, record);
    }
    /**
     * Clean up expired records (should be called periodically)
     */
    async cleanup() {
        const now = new Date();
        for (const [keyStr, record] of this.storage.entries()) {
            if (new Date(record.key.expiresAt) < now) {
                this.storage.delete(keyStr);
            }
        }
    }
    /**
     * Get statistics about idempotency cache
     */
    getStats() {
        const now = new Date();
        let lockedKeys = 0;
        let expiredKeys = 0;
        for (const record of this.storage.values()) {
            if (record.locked)
                lockedKeys++;
            if (new Date(record.key.expiresAt) < now)
                expiredKeys++;
        }
        return {
            totalKeys: this.storage.size,
            lockedKeys,
            expiredKeys
        };
    }
}
//# sourceMappingURL=idempotency-service.js.map