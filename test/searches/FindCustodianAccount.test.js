const zapier = require('zapier-platform-core');

// Use this to make test calls into your app:
const App = require('../../index');
const appTester = zapier.createAppTester(App);

zapier.tools.env.inject();

describe('searches.FindCustodianAccount', () => {
    it(App.searches.FindCustodianAccount.key, async () => {

        const bundle = {
            authData: {
                server_url: process.env.SERVER_URL,
                api_key: process.env.API_KEY
            },
            rawRequest: {
                headers: {
                    'Http-Btcpay-Sig': 'sha256=4ec27a6ca16dbc7b8c7ddfb5654b1f8dbf8c69a439e970fd2bfac6e19713f211'
                },
                content: '{\n' +
                    '  "deliveryId": "PENf2czGBzTepjzSJdt6Nz",\n' +
                    '  "webhookId": "6KQ4EmzqKowRgyBL65TwJg",\n' +
                    '  "originalDeliveryId": "PENf2czGBzTepjzSJdt6Nz",\n' +
                    '  "isRedelivery": false,\n' +
                    '  "type": "InvoiceCreated",\n' +
                    '  "timestamp": 1623954207,\n' +
                    '  "storeId": "Hf9GvFK2dHJehm9J8A6kYfbc1ruc5jEZBKEr9r7jsrLo",\n' +
                    '  "invoiceId": "CQZj4Qbm475EJQ5HsWeAbd"\n' +
                    '}' // Hard coded because it is used to calculate the "BTCPay-Sig"
            },
            inputData: {
                store_id: process.env.STORE_ID,
                custodian_account_id: process.env.CUSTODIAN_ACCOUNT_ID,
            },
        }

        const results = await appTester(App.searches.FindCustodianAccount.operation.perform, bundle);

        expect(results).toBeDefined();
        expect(results.length).toBe(1);

        const custodianAccount = results[0];

        expect(custodianAccount.id).toBe(process.env.CUSTODIAN_ACCOUNT_ID);
        expect(custodianAccount.storeId).toBe(process.env.STORE_ID);
        expect(custodianAccount.name).toBeDefined();
        expect(custodianAccount.custodianCode).toBeDefined();
        expect(custodianAccount.assetBalances).toBeDefined();

    });
});
