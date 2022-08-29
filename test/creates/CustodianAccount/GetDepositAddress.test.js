const zapier = require('zapier-platform-core');
const App = require('../../../index');
const appTester = zapier.createAppTester(App);

zapier.tools.env.inject();

describe('creates.custodianAccountDeposit', () => {
    test(App.creates.GetCustodianAccountDepositAddress.key, async () => {
            const paymentMethod = 'BTC-OnChain';

            const bundle = {
                authData: {
                    server_url: process.env.SERVER_URL,
                    api_key: process.env.API_KEY
                },
                inputData: {
                    store_id: process.env.STORE_ID,
                    custodian_account_id: process.env.CUSTODIAN_ACCOUNT_ID,
                    payment_method: paymentMethod
                },
            }

            const address = await appTester(App.creates.GetCustodianAccountDepositAddress.operation.perform, bundle);

            expect(address).toBeDefined();
            expect(address.address).toBeDefined();

        }
    );
});
