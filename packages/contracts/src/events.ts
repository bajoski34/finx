// AsyncAPI event schemas for the framework

export interface CoreEvent {
  id: string;
  type: string;
  source: string;
  timestamp: string;
  data: Record<string, any>;
  metadata?: Record<string, any>;
}

export interface PaymentSucceededEvent extends CoreEvent {
  type: 'events.payment.succeeded';
  data: {
    payment_intent_id: string;
    amount: number;
    currency: string;
    provider_rail: string;
    provider_id: string;
  };
}

export interface PaymentFailedEvent extends CoreEvent {
  type: 'events.payment.failed';
  data: {
    payment_intent_id: string;
    amount: number;
    currency: string;
    error_code: string;
    error_message: string;
  };
}

export interface PayoutCompletedEvent extends CoreEvent {
  type: 'events.payout.completed';
  data: {
    payout_id: string;
    amount: number;
    currency: string;
    beneficiary_account: string;
  };
}

export interface VirtualAccountCreditEvent extends CoreEvent {
  type: 'events.virtual_account.credit';
  data: {
    virtual_account_id: string;
    amount: number;
    currency: string;
    reference: string;
  };
}