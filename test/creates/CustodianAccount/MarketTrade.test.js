const zapier = require('zapier-platform-core');
const App = require('../../../index');
const appTester = zapier.createAppTester(App);

zapier.tools.env.inject();

describe('creates.custodianAccountMarketTrade', () => {
    test(App.creates.CustodianAccountMarketTrade.key, async () => {
            const fromAsset = 'EUR';
            const toAsset = 'BTC';

            const bundle = {
                authData: {
                    server_url: process.env.SERVER_URL,
                    api_key: process.env.API_KEY
                },
                inputData: {
                    store_id: process.env.STORE_ID,
                    custodian_account_id: process.env.CUSTODIAN_ACCOUNT_ID,
                    from_asset: fromAsset,
                    to_asset: toAsset,
                    qty: 5
                },
            }

            const trade = await appTester(App.creates.CustodianAccountMarketTrade.operation.perform, bundle);

            expect(trade).toBeDefined();
            expect(trade.fromAsset).toBe(fromAsset);
            expect(trade.toAsset).toBe(toAsset);
            expect(trade.ledgerEntries).toBeDefined();
            expect(trade.ledgerEntries).toHaveLength(3);
            expect(trade.tradeId).toBeDefined();
            expect(trade.accountId).toBeDefined();
            // TODO there doesn't seam to be a field "storeId" in the response. Add it to the Greenfield API and then here as well...

        }
    );
});
