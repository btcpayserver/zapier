const zapier = require('zapier-platform-core');
const App = require('../../index');
const appTester = zapier.createAppTester(App);

zapier.tools.env.inject();

describe('creates.OpenStoreLightningChannel', () => {
    it(App.creates.OpenStoreLightningChannel.key, async () => {

        const bundle = {
            authData: {
                server_url: process.env.SERVER_URL,
                api_key: process.env.API_KEY
            },
            inputData: {
                store_id: process.env.STORE_ID,
                crypto_code: 'BTC',
                node_uri: '',
                amount: 0.001,
                fee_rate: 1,
            },
        }

        const results = await appTester(App.creates.OpenStoreLightningChannel.operation.perform, bundle);

        expect(results).toBeDefined();
        expect(results.opening).toBeTruthy();

    });
});
