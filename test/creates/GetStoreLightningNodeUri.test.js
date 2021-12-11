const zapier = require('zapier-platform-core');
const App = require('../../index');
const appTester = zapier.createAppTester(App);

zapier.tools.env.inject();

describe('creates.GetStoreLightningNodeUri', () => {
    it(App.creates.GetStoreLightningNodeUri.key, async () => {

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

        const results = await appTester(App.creates.GetStoreLightningNodeUri.operation.perform, bundle);

        expect(results).toBeDefined();
        expect(results.clearnetUri).toBeDefined();
        expect(results.torUri).toBeDefined();

    });
});
