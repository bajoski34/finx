// ==========================
// User / Customer
// ==========================
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
}

// ==========================
// Merchant
// ==========================
export type MerchantStatus = 'active' | 'inactive' | 'suspended';

export interface Merchant {
  id: string;
  name: string;
  email: string;
  phone?: string;
  website?: string;
  currency: string; // Default currency for merchant
  status: MerchantStatus;
  createdAt: string;
  updatedAt: string;
}

// ==========================
// Account
// ==========================
export type AccountType = 'wallet' | 'bank' | 'card' | 'virtual';
export type AccountStatus = 'active' | 'inactive' | 'suspended';

export interface Account {
  id: string;
  ownerId: string; // userId or merchantId
  ownerType: 'user' | 'merchant';
  currency: string;
  balance: number;
  type: AccountType;
  status: AccountStatus;
  createdAt: string;
  updatedAt: string;
}

// ==========================
// Transaction
// ==========================
export type TransactionType =
  | 'credit'
  | 'debit'
  | 'transfer'
  | 'payment'
  | 'refund'
  | 'payout'
  | 'swap';
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
  metadata?: Record<string, any>; // for additional info
  createdAt: string;
  updatedAt: string;
}

// ==========================
// Payment / Payout
// ==========================
export type PaymentMethod = 'card' | 'bank' | 'mobileMoney' | 'crypto';

export interface PaymentRequest {
  payerId: string; // user or merchant
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

// ==========================
// Refund
// ==========================
export interface RefundRequest {
  transactionId: string;
  amount?: number; // optional partial refund
  reason?: string;
}

export interface RefundResponse {
  success: boolean;
  refundId?: string;
  error?: string;
}

// ==========================
// Exchange / Swap
// ==========================
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

// ==========================
// Payment Provider / Integration
// ==========================
export interface PaymentProvider {
  id: string;
  name: string;
  supportedCurrencies: string[];
  supportedMethods: string[];
  isActive: boolean;
  config: Record<string, any>;
}

// ==========================
// Telemetry / Logging
// ==========================
export interface TelemetryEvent {
  event: string;
  userId?: string;
  merchantId?: string;
  data?: Record<string, any>;
  timestamp: string;
}

// ==========================
// Subscriptions (Recurring Payments)
// ==========================
export interface Subscription {
  id: string;
  subscriberId: string; // user or merchant
  subscriberType: 'user' | 'merchant';
  amount: number;
  currency: string;
  interval: 'daily' | 'weekly' | 'monthly' | 'yearly';
  nextBillingDate: string;
  status: 'active' | 'paused' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

// ==========================
// Fees
// ==========================
export interface Fee {
  type: 'flat' | 'percentage';
  value: number;
}

export interface VirtualAccountRouting {
  virtualAccountId: string;
  merchantId: string;
  currency: string;
  providerId: string; // preferred provider for this VA
}

// ==========================
// API Response Wrapper
// ==========================
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

// ==========================
// Virtual Accounts (Merchant-specific)
// ==========================
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

// ==========================
// Multi-Rail Transactions (Optional)
// ==========================
export interface MultiRailTransaction {
  id: string;
  sourceAccountId: string;
  destinationAccountId: string;
  amount: number;
  currency: string;
  rails: string[]; // providers used
  fees?: Fee[];
  status: TransactionStatus;
  metadata?: Record<string, any>;
  fallbackAttempts?: number;
  createdAt: string;
  updatedAt: string;
}

export type RailCapabilities = {
    rails: ("card"|"bank_transfer"|"open_banking"|"mobile_money"|"wallet")[];
    currencies: string[];
    countries: string[];
    features: string[]; // 3DS2, mandate, tokenization, payouts, refunds
};

export type ProviderIntentRef = {
    id: string;
    providerId: string;
    status: 'pending'|'completed'|'failed';
    createdAt: string;
    updatedAt: string;
}

export type RefundRef = {
    id: string;
    transactionId: string;
    amount: number;
}

export type PayoutRef = {
    id: string;
    transactionId: string;
}

export type VARef = {
    id: string;
    virtualAccountId: string;
    status: VirtualAccountStatus;
    createdAt: string;
    updatedAt: string;
}

export type CoreEvent = {
    type: string;
    data: any;
}

export type PaymentIntent = {
    amount: number;
    currency: string;
    description?: string;
    metadata?: Record<string, any>;
}

export type PayoutRequest = {
    amount: number;
    currency: string;
}

export type VARequest = {
    name: string;
}

export interface RailAdapter {
    key: string; // e.g. "flutterwave", "paystack"
    health(): Promise<{ status: 'up'|'down'; latencyMs: number }>;
    capabilities(): Promise<RailCapabilities>;
    // Collections
    createPaymentIntent(pi: PaymentIntent): Promise<ProviderIntentRef>;
    confirmPaymentIntent(id: string, data?: any): Promise<ProviderIntentRef>;
    refund(paymentId: string, amountMinor?: number): Promise<RefundRef>;
    // Payouts
    createPayout(tx: PayoutRequest): Promise<PayoutRef>;
    getPayout(id: string): Promise<PayoutRef>;
    // Virtual Accounts
    createVA(req: VARequest): Promise<VARef>;
    closeVA(id: string): Promise<void>;
// Webhooks
    verifyWebhook(sigHeader: string, payload: string): boolean;
    mapWebhook(event: any): CoreEvent; // normalise → core event
}