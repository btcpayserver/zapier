const zapier = require('zapier-platform-core');
const App = require('../../../index');
const appTester = zapier.createAppTester(App);

zapier.tools.env.inject();

describe('creates.custodianAccountGetCustodianAccountAssetBalance', () => {
    test(App.creates.GetCustodianAccountAssetBalance.key, async () => {
            const asset = 'BTC';

            const bundle = {
                authData: {
                    server_url: process.env.SERVER_URL,
                    api_key: process.env.API_KEY
                },
                inputData: {
                    store_id: process.env.STORE_ID,
                    custodian_account_id: process.env.CUSTODIAN_ACCOUNT_ID,
                    asset: asset
                },
            }

            const balance = await appTester(App.creates.GetCustodianAccountAssetBalance.operation.perform, bundle);

            expect(balance).toBeDefined();
            expect(balance.asset).toBeDefined();
            expect(balance.qty).toBeDefined();

        }
    );
});
