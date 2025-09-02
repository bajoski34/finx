# Finx Framework - Developer Documentation

## Overview

Finx is an open, extensible fintech framework that enables developers to build complete fintech platforms by composing "rails" (payment providers and networks) as adapters. The framework is opinionated where it matters (security, idempotency, ledgers, observability) and flexible everywhere else (plugins, routing policies, data models).

## Architecture

```
finx/
├── apps/
│   ├── api-gateway/          # REST API + Webhooks (Fastify)
│   ├── cli/                  # Development tools and utilities
│   └── control-center/       # Admin console (Next.js) [TODO]
├── packages/
│   ├── contracts/            # OpenAPI, JSON Schema, AsyncAPI
│   ├── core-domain/          # DDD aggregates, policies
│   ├── adapter/              # Rail adapters (sandbox, flutterwave, etc.)
│   ├── orchestration/        # Router, health, retries [TODO]
│   ├── ledger/               # Double-entry + balances [TODO]
│   ├── telemetry/            # OpenTelemetry + Mixpanel
│   ├── idempotency/          # Request keys, locks, safe concurrency
│   ├── storage/              # DB ports: Postgres, MySQL, Redis [TODO]
│   └── plugins/              # Risk, KYC, rules, fees, etc. [TODO]
└── examples/
    └── wordpress-plugin/     # Demo integration
```

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Build All Packages

```bash
npm run build
```

### 3. Run Tests

```bash
npm run test
```

### 4. Start Development

```bash
# Start API Gateway
npm run dev

# Use CLI tools
npx finx --help
```

## Core Concepts

### Rail Adapters

Rail adapters provide a unified interface to different payment providers:

```typescript
interface RailAdapter {
  key: string;
  health(): Promise<{ status: 'up'|'down'; latencyMs: number }>;
  capabilities(): Promise<RailCapabilities>;
  createPaymentIntent(pi: PaymentIntent): Promise<ProviderIntentRef>;
  confirmPaymentIntent(id: string, data?: any): Promise<ProviderIntentRef>;
  // ... more methods
}
```

### Sandbox Adapter

The framework includes a sandbox adapter for testing:

```typescript
import { SandboxAdapter } from '@finx/adapters';

const adapter = new SandboxAdapter();
const intent = await adapter.createPaymentIntent({
  amount: 10000, // 100.00 in minor units
  currency: 'NGN',
  description: 'Test payment'
});
```

### Idempotency

Built-in request idempotency ensures safe retries:

```typescript
import { IdempotencyService } from '@finx/idempotency';

const service = new IdempotencyService();
const key = service.generateKey('POST', '/payments', body, orgId);
const cached = await service.checkIdempotency(key);
```

### Telemetry

Structured observability with OpenTelemetry and Mixpanel:

```typescript
import { OpenTelemetryProvider, MixpanelProvider } from '@finx/telemetry';

const otel = new OpenTelemetryProvider();
const span = otel.createSpan('payment.create', { rail: 'sandbox' });
// ... process payment
otel.finishSpan(span);
```

## API Reference

### Payment Intents

```bash
# Create payment intent
POST /api/v1/payment-intents
{
  "amount": 10000,
  "currency": "NGN",
  "customer": {
    "email": "customer@example.com"
  }
}
```

### Health Check

```bash
GET /health
```

## Development Workflow

### Adding a New Adapter

1. Create adapter package in `packages/adapters/[provider]`
2. Implement `RailAdapter` interface
3. Add manifest with capabilities
4. Add tests
5. Register in orchestration layer

### CLI Commands

```bash
# Create new adapter
npx finx adapter new flutterwave --type payment

# Start sandbox
npx finx sandbox --port 3001

# Test routes
npx finx routes test

# Import reconciliation
npx finx recon import statements.csv
```

## Testing

The framework includes comprehensive test coverage:

```bash
# Run all tests
npm run test

# Run specific package tests
npx nx test adapter
npx nx test idempotency

# Run with coverage
npm run test:coverage
```

## Deployment

### Development

```bash
npm run dev
```

### Production

```bash
npm run build
npm start
```

## Configuration

Environment variables for configuration:

```bash
# API Gateway
PORT=3000
NODE_ENV=production

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=finx_prod

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Telemetry
MIXPANEL_PROJECT_TOKEN=your_token
OTEL_ENDPOINT=http://localhost:4317
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

## Roadmap

### Completed (Weeks 1-2)
- [x] Nx workspace setup
- [x] OpenAPI contracts
- [x] Sandbox rail adapter
- [x] Idempotency service
- [x] Telemetry skeleton
- [x] API Gateway basics
- [x] CLI foundation

### Next Steps (Weeks 3-5)
- [ ] Payment intent workflows
- [ ] Webhook handling
- [ ] Ledger v1 implementation
- [ ] Router and orchestration
- [ ] Real adapter (Flutterwave/Paystack)

### Future Features
- [ ] Payouts and virtual accounts
- [ ] Reconciliation engine
- [ ] Admin console UI
- [ ] WordPress/Shopify plugins
- [ ] Advanced compliance features

## License

ISC License - see LICENSE file for details.

## Support

- Documentation: [GitHub Wiki]
- Issues: [GitHub Issues]
- Discussions: [GitHub Discussions]