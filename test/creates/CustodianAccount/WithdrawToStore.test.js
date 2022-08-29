const zapier = require('zapier-platform-core');
const App = require('../../../index');
const appTester = zapier.createAppTester(App);

zapier.tools.env.inject();

describe('creates.custodianAccountWithdrawToStore', () => {
    test(App.creates.CustodianAccountWithdrawToStore.key, async () => {
            const asset = 'BTC';
            const paymentMethod = 'BTC-OnChain';

            const bundle = {
                authData: {
                    server_url: process.env.SERVER_URL,
                    api_key: process.env.API_KEY
                },
                inputData: {
                    store_id: process.env.STORE_ID,
                    custodian_account_id: process.env.CUSTODIAN_ACCOUNT_ID,
                    payment_method: paymentMethod,
                    qty: 0.0005
                },
            }

            const withdrawal = await appTester(App.creates.CustodianAccountWithdrawToStore.operation.perform, bundle);

            expect(withdrawal).toBeDefined();
            expect(withdrawal.asset).toBe(asset);
            expect(withdrawal.paymentMethod).toBe(paymentMethod);
            expect(withdrawal.ledgerEntries).toBeDefined();
            expect(withdrawal.ledgerEntries).toHaveLength(2);
            expect(withdrawal.withdrawalId).toBeDefined();
            expect(withdrawal.accountId).toBeDefined();
            expect(withdrawal.status).toBeDefined();
            expect(withdrawal.custodianCode).toBeDefined();
            expect(withdrawal.transactionId).toBeDefined();
            expect(withdrawal.targetAddress).toBeDefined();
            // TODO there doesn't seam to be a field "storeId" in the response. Add it to the Greenfield API and then here as well...

        }
    );
});
