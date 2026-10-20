const zapier = require('zapier-platform-core');
const App = require('../../index');
const appTester = zapier.createAppTester(App);

zapier.tools.env.inject();

describe('creates.OpenStoreLightningChannel', () => {
    // Opens a real channel, so it only runs when LIGHTNING_NODE_URI is set.
    const itIfNode = process.env.LIGHTNING_NODE_URI ? it : it.skip;

    itIfNode(App.creates.OpenStoreLightningChannel.key, async () => {

        const bundle = {
            authData: {
                server_url: process.env.SERVER_URL,
                api_key: process.env.API_KEY
            },
            inputData: {
                store_id: process.env.STORE_ID,
                crypto_code: 'BTC',
                node_uri: process.env.LIGHTNING_NODE_URI,
                amount: 100000,
                fee_rate: 1,
            },
        }

        const results = await appTester(App.creates.OpenStoreLightningChannel.operation.perform, bundle);

        expect(results).toBeDefined();
        expect(results.opening).toBeTruthy();

    });
});
