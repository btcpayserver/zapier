const zapier = require('zapier-platform-core');
const App = require('../../index');
const appTester = zapier.createAppTester(App);

zapier.tools.env.inject();

describe('creates.PayLightningInvoice', () => {
    // Pays a real invoice, so it only runs when BOLT11 is set.
    const testIfInvoice = process.env.BOLT11 ? test : test.skip;

    testIfInvoice(App.creates.PayLightningInvoice.key, async () => {
            const cryptoCode = 'BTC';
            const storeId = process.env.STORE_ID;

            const bundle = {
                authData: {
                    server_url: process.env.SERVER_URL,
                    api_key: process.env.API_KEY
                },
                inputData: {
                    store_id: storeId,
                    crypto_code: cryptoCode,
                    bolt11: process.env.BOLT11
                },
            }

            const result = await appTester(App.creates.PayLightningInvoice.operation.perform, bundle);

            expect(result).toBeDefined();
            expect(result.paid).toBe(true);
            expect(result.status).toBe('Complete');
            expect(result.paymentHash).toBeDefined();
        }
    );
});
