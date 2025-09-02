type PaymentIntent = {
    _id: string;
    amount: number;
    currency: string;
    payment: {
        medium: string;
        network: string;
    },
    trace: object,
    created_at: Date,
    updated_at: Date
}
type SupportedCurrencies = ['NGN', 'USD', 'GBP', 'PHP','']