# Finx Framework Demo

This example demonstrates the complete Finx framework setup with a working payment flow using the sandbox adapter.

## Setup

```bash
# Build all packages
npm run build

# Run the API Gateway
node dist/apps/api-gateway/src/main.js

# Test with the CLI
node dist/apps/cli/src/main.js --help
```

## Framework Components

1. **API Gateway** - REST API with payment endpoints
2. **Sandbox Adapter** - Mock payment provider for testing
3. **Idempotency Service** - Safe request retries
4. **Telemetry** - OpenTelemetry + Mixpanel integration
5. **Contracts** - OpenAPI specifications

## Payment Flow

```javascript
// 1. Create payment intent
POST /api/v1/payment-intents
{
  "amount": 10000,
  "currency": "NGN",
  "customer": { "email": "test@example.com" }
}

// 2. Sandbox processes payment
// 3. Webhook events triggered
// 4. Ledger postings created
```

This implements the MVP roadmap from the problem statement, focusing on weeks 1-2: contracts, sandbox rail, idempotency, and telemetry skeleton.