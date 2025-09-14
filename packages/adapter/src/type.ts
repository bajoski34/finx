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