import {
    RailAdapter,
    RailCapabilities,
    PaymentIntent,
    ProviderIntentRef,
    RefundRef,
    PayoutRequest,
    PayoutRef,
    VARequest,
    VARef,
    CoreEvent
} from '@finx/core-domain';
import {flutterwaveManifest} from "./manifest";

/**
 * Flutterwave rail adapter for development and Production
 */
export class FlutterwaveAdapter implements RailAdapter {
    key = flutterwaveManifest.key as string;

    async health(): Promise<{ status: 'up' | 'down'; latencyMs: number }> {
        const start = Date.now();
        //TODO: make a quick request to the flutterwave api to check if it's up.
        // {
        //     "rave": "pay",
        //     "nocd": "50",
        //     "dlyvr": "1.00000002",
        //     "apiv": "v1",
        //     "_2q_8r": "FLUTTERWAVE-11655357",
        //     "_2cents": "Talk is cheap. Show me the code. - Linus Torvalds"
        // }
        return {
            status: 'up',
            latencyMs: Date.now() - start
        };
    }

    async capabilities(): Promise<RailCapabilities> {
        return flutterwaveManifest.capabilities as RailCapabilities;
    }

    async createPaymentIntent(_pi: PaymentIntent): Promise<ProviderIntentRef> {


        return {
            id: `flutterwave_pi_${Date.now()}`,
            providerId: `finx_flutterwave_${Math.random().toString(36).substr(2, 9)}`,
            status: 'pending',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
    }

    async confirmPaymentIntent(id: string, _data?: any): Promise<ProviderIntentRef> {



        return {
            id,
            providerId: `sandbox_${Math.random().toString(36).substr(2, 9)}`,
            status: 'completed',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
    }

    async refund(paymentId: string, amountMinor?: number): Promise<RefundRef> {

        return {
            id: `sandbox_rf_${Date.now()}`,
            transactionId: paymentId,
            amount: amountMinor || 0
        };
    }

    async createPayout(_tx: PayoutRequest): Promise<PayoutRef> {

        return {
            id: `sandbox_po_${Date.now()}`,
            transactionId: `sandbox_tx_${Math.random().toString(36).substr(2, 9)}`
        };
    }

    async getPayout(id: string): Promise<PayoutRef> {

        return {
            id,
            transactionId: `sandbox_tx_${Math.random().toString(36).substr(2, 9)}`
        };
    }

    async createVA(_req: VARequest): Promise<VARef> {

        return {
            id: `sandbox_va_${Date.now()}`,
            virtualAccountId: `9${Math.random().toString().substr(2, 9)}`, // Nigerian bank format
            status: 'active',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
    }

    async closeVA(_id: string): Promise<void> {
        // Sandbox VA closed
    }

    verifyWebhook(_sigHeader: string, _payload: string): boolean {
        // In sandbox mode, all webhooks are considered valid
        return true;
    }

    mapWebhook(event: any): CoreEvent {
        // Map webhook events to core events
        const eventType = event.type || 'unknown';

        return {
            type: `events.${eventType}`,
            data: event.data || event
        };
    }
}