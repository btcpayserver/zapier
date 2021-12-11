const zapier = require('zapier-platform-core');
const App = require('../../index');
const appTester = zapier.createAppTester(App);

zapier.tools.env.inject();

describe('creates.GenerateStoreOnChainWalletAddress', () => {
    test(App.creates.GenerateStoreOnChainWalletAddress.key, async () => {
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
                    force_generate: false
                },
            }

            const address = await appTester(App.creates.GenerateStoreOnChainWalletAddress.operation.perform, bundle);

            expect(address).toBeDefined();
            expect(address.address).toBeDefined();
            expect(address.keyPath).toBeDefined();
            expect(address.paymentLink).toBeDefined();

        }
    );
});
