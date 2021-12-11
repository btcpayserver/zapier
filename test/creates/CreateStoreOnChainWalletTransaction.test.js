const zapier = require('zapier-platform-core');
const App = require('../../index');
const appTester = zapier.createAppTester(App);

zapier.tools.env.inject();

describe('creates.CreateStoreOnChainWalletTransaction', () => {
    test(App.creates.GenerateStoreOnChainWalletAddress.key, async () => {
            const cryptoCode = 'BTC';
            const storeId = process.env.STORE_ID;
            const amount = 0.0001;
            const destination = 'bcrt1qmdnl03s3wzp9suvgzy063vh6sght34nj3hfheq';
            const subtractFeeFromAmount = false;
            const feeRate = 1;

            const bundle = {
                authData: {
                    server_url: process.env.SERVER_URL,
                    api_key: process.env.API_KEY
                },
                rawRequest: {
                    headers: {},
                },
                inputData: {
                    store_id: storeId,
                    crypto_code: cryptoCode,
                    amount: amount,
                    destination: destination,
                    subtract_fee_from_amount: subtractFeeFromAmount,
                    fee_rate: feeRate
                },
            }

            const tx = await appTester(App.creates.CreateStoreOnChainWalletTransaction.operation.perform, bundle);

            expect(tx).toBeDefined();
            expect(tx.transactionHash).toBeDefined();
            expect(tx.comment).toBeDefined();
            expect(tx.labels).toBeDefined();
            expect(tx.amount).toBeDefined();
            expect(tx.blockHash).toBeDefined();
            expect(tx.blockHeight).toBeDefined();
            expect(tx.confirmations).toBe(0);
            expect(tx.timestamp).toBeGreaterThan(1638547484);
            expect(tx.status).toBe('Unconfirmed');
        }
    );
});
