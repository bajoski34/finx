export interface AdapterManifest {
  name: string;
  key: string;
  version: string;
  capabilities: {
    rails: ('card' | 'bank_transfer' | 'open_banking' | 'mobile_money' | 'wallet')[];
    currencies: string[];
    countries: string[];
    features: string[];
  };
  configSchema: {
    type: 'object';
    required: string[];
    properties: Record<string, any>;
  };
}

export const sandboxManifest: AdapterManifest = {
  name: '@finx/sandbox-adapter',
  key: 'sandbox',
  version: '1.0.0',
  capabilities: {
    rails: ['card', 'bank_transfer', 'open_banking', 'mobile_money', 'wallet'],
    currencies: ['NGN', 'USD', 'GBP', 'EUR', 'KES', 'GHS'],
    countries: ['NG', 'US', 'GB', 'KE', 'GH'],
    features: ['3DS2', 'mandate', 'tokenization', 'payouts', 'refunds', 'webhooks']
  },
  configSchema: {
    type: 'object',
    required: ['mode'],
    properties: {
      mode: {
        type: 'string',
        enum: ['test', 'demo'],
        default: 'test'
      },
      mockDelay: {
        type: 'number',
        minimum: 0,
        maximum: 5000,
        default: 1000,
        description: 'Simulated network delay in milliseconds'
      },
      failureRate: {
        type: 'number',
        minimum: 0,
        maximum: 1,
        default: 0.1,
        description: 'Simulated failure rate (0.0 to 1.0)'
      }
    }
  }
};