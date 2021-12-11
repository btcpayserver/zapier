const zapier = require('zapier-platform-core');
const App = require('../../index');
const appTester = zapier.createAppTester(App);

zapier.tools.env.inject();

describe('creates.GetStoreOnChainBalance', () => {
    it(App.creates.GetStoreOnChainBalance.key, async () => {

        const bundle = {
            authData: {
                server_url: process.env.SERVER_URL,
                api_key: process.env.API_KEY
            },
            inputData: {
                store_id: process.env.STORE_ID,
                crypto_code: 'BTC',
            },
        }

        const results = await appTester(App.creates.GetStoreOnChainBalance.operation.perform, bundle);

        expect(results).toBeDefined();
        expect(results.balance).toBeDefined();
        expect(results.confirmedBalance).toBeDefined();
        expect(results.unconfirmedBalance).toBeDefined();

    });
});
