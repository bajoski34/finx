export interface User {
    id: string;
    name: string;
    email: string;
    phone?: string;
    createdAt: string;
    updatedAt: string;
}
export type MerchantStatus = 'active' | 'inactive' | 'suspended';
export interface Merchant {
    id: string;
    name: string;
    email: string;
    phone?: string;
    website?: string;
    currency: string;
    status: MerchantStatus;
    createdAt: string;
    updatedAt: string;
}
export type AccountType = 'wallet' | 'bank' | 'card' | 'virtual';
export type AccountStatus = 'active' | 'inactive' | 'suspended';
export interface Account {
    id: string;
    ownerId: string;
    ownerType: 'user' | 'merchant';
    currency: string;
    balance: number;
    type: AccountType;
    status: AccountStatus;
    createdAt: string;
    updatedAt: string;
}
export type TransactionType = 'credit' | 'debit' | 'transfer' | 'payment' | 'refund' | 'payout' | 'swap';
export type TransactionStatus = 'pending' | 'completed' | 'failed';
export interface Transaction {
    id: string;
    accountId: string;
    type: TransactionType;
    amount: number;
    currency: string;
    status: TransactionStatus;
    description?: string;
    reference: string;
    metadata?: Record<string, any>;
    createdAt: string;
    updatedAt: string;
}
export type PaymentMethod = 'card' | 'bank' | 'mobileMoney' | 'crypto';
export interface PaymentRequest {
    payerId: string;
    payerType: 'user' | 'merchant';
    amount: number;
    currency: string;
    method: PaymentMethod;
    description?: string;
    metadata?: Record<string, any>;
}
export interface PaymentResponse {
    success: boolean;
    transactionId?: string;
    error?: string;
}
export interface RefundRequest {
    transactionId: string;
    amount?: number;
    reason?: string;
}
export interface RefundResponse {
    success: boolean;
    refundId?: string;
    error?: string;
}
export interface ExchangeRate {
    fromCurrency: string;
    toCurrency: string;
    rate: number;
    updatedAt: string;
}
export interface SwapRequest {
    userId: string;
    fromAmount: number;
    fromCurrency: string;
    toCurrency: string;
}
export interface SwapResponse {
    success: boolean;
    fromAmount: number;
    toAmount: number;
    fromCurrency: string;
    toCurrency: string;
    transactionId?: string;
    error?: string;
}
export interface PaymentProvider {
    id: string;
    name: string;
    supportedCurrencies: string[];
    supportedMethods: string[];
    isActive: boolean;
    config: Record<string, any>;
}
export interface TelemetryEvent {
    event: string;
    userId?: string;
    merchantId?: string;
    data?: Record<string, any>;
    timestamp: string;
}
export interface Subscription {
    id: string;
    subscriberId: string;
    subscriberType: 'user' | 'merchant';
    amount: number;
    currency: string;
    interval: 'daily' | 'weekly' | 'monthly' | 'yearly';
    nextBillingDate: string;
    status: 'active' | 'paused' | 'cancelled';
    createdAt: string;
    updatedAt: string;
}
export interface Fee {
    type: 'flat' | 'percentage';
    value: number;
}
export interface VirtualAccountRouting {
    virtualAccountId: string;
    merchantId: string;
    currency: string;
    providerId: string;
}
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
}
export type VirtualAccountStatus = 'active' | 'inactive' | 'closed';
export interface VirtualAccount {
    id: string;
    merchantId: string;
    name: string;
    currency: string;
    accountNumber: string;
    bank: string;
    status: VirtualAccountStatus;
    createdAt: string;
    updatedAt: string;
}
export interface MultiRailTransaction {
    id: string;
    sourceAccountId: string;
    destinationAccountId: string;
    amount: number;
    currency: string;
    rails: string[];
    fees?: Fee[];
    status: TransactionStatus;
    metadata?: Record<string, any>;
    fallbackAttempts?: number;
    createdAt: string;
    updatedAt: string;
}
export type RailCapabilities = {
    rails: ("card" | "bank_transfer" | "open_banking" | "mobile_money" | "wallet")[];
    currencies: string[];
    countries: string[];
    features: string[];
};
export type ProviderIntentRef = {
    id: string;
    providerId: string;
    status: 'pending' | 'completed' | 'failed';
    createdAt: string;
    updatedAt: string;
};
export type RefundRef = {
    id: string;
    transactionId: string;
    amount: number;
};
export type PayoutRef = {
    id: string;
    transactionId: string;
};
export type VARef = {
    id: string;
    virtualAccountId: string;
    status: VirtualAccountStatus;
    createdAt: string;
    updatedAt: string;
};
export type CoreEvent = {
    type: string;
    data: any;
};
export type PaymentIntent = {
    amount: number;
    currency: string;
    description?: string;
    metadata?: Record<string, any>;
};
export type PayoutRequest = {
    amount: number;
    currency: string;
};
export type VARequest = {
    name: string;
};
export interface RailAdapter {
    key: string;
    health(): Promise<{
        status: 'up' | 'down';
        latencyMs: number;
    }>;
    capabilities(): Promise<RailCapabilities>;
    createPaymentIntent(pi: PaymentIntent): Promise<ProviderIntentRef>;
    confirmPaymentIntent(id: string, data?: any): Promise<ProviderIntentRef>;
    refund(paymentId: string, amountMinor?: number): Promise<RefundRef>;
    createPayout(tx: PayoutRequest): Promise<PayoutRef>;
    getPayout(id: string): Promise<PayoutRef>;
    createVA(req: VARequest): Promise<VARef>;
    closeVA(id: string): Promise<void>;
    verifyWebhook(sigHeader: string, payload: string): boolean;
    mapWebhook(event: any): CoreEvent;
}
