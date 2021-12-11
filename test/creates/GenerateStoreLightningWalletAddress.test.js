const zapier = require('zapier-platform-core');
const App = require('../../index');
const appTester = zapier.createAppTester(App);

zapier.tools.env.inject();

describe('creates.GenerateStoreLightningWalletAddress', () => {
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
                },
            }

            const result = await appTester(App.creates.GenerateStoreLightningWalletAddress.operation.perform, bundle);

            expect(result).toBeDefined();
            expect(result.address).toBeDefined();
        }
    );
});
