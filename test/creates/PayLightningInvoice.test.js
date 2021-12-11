const zapier = require('zapier-platform-core');
const App = require('../../index');
const appTester = zapier.createAppTester(App);

zapier.tools.env.inject();

describe('creates.PayLightningInvoice', () => {
    test(App.creates.GenerateStoreLightningWalletAddress.key, async () => {
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
                    bolt11: "xxx" // TODO enter a sample BOLT11 invoice
                },
            }

            const result = await appTester(App.creates.PayLightningInvoice.operation.perform, bundle);

            expect(result).toBeDefined();
            expect(result.paid).toBeDefined();
        }
    );
});
