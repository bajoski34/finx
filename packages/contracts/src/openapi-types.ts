// Generated TypeScript types from OpenAPI schema
// This would typically be auto-generated from openapi.yml

export interface HealthResponse {
  status: 'ok' | 'error';
  service: string;
  version: string;
  environment?: string;
}

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: 'requires_method' | 'processing' | 'succeeded' | 'failed' | 'canceled';
  capture: boolean;
  customer: Customer;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface Customer {
  id?: string;
  email: string;
  name?: string;
  phone?: string;
}

export interface CreatePaymentIntentRequest {
  amount: number;
  currency: string;
  customer: Customer;
  capture?: boolean;
  metadata?: Record<string, any>;
}

export interface ErrorResponse {
  error: string;
  message: string;
  details?: Record<string, any>;
}