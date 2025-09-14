import {AdapterManifest} from "../type";

export const flutterwaveManifest: AdapterManifest = {
    name: '@finx/flutterwave-adapter',
    key: 'flutterwave',
    version: '3.0.0',
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
                enum: ['development', 'production'],
                default: 'development'
            }
        }
    }
};