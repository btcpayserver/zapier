/* globals describe, expect, test */

const zapier = require('zapier-platform-core');

// createAppTester() makes it easier to test your app. It takes your raw app
// definition, and returns a function that will test you app.
const App = require('../../index');
const Util = require('../../common/Util');

const appTester = zapier.createAppTester(App);

// Inject the vars from the .env file to process.env. Do this if you have a .env
// file.
zapier.tools.env.inject();

describe('triggers', () => {
    test(App.triggers.InvoiceProcessing.key + ' webhook', async () => {

        const invoiceId = process.env.INVOICE_ID;

        let bundle = {
            authData: {
                server_url: process.env.SERVER_URL,
                api_key: process.env.API_KEY
            },
            subscribeData: {
                secret: '5TjrCfkTgfjY4rJj85bTJj'
            },
            rawRequest: {
                content: '{\n' +
                    '  "deliveryId": "PENf2czGBzTepjzSJdt6Nz",\n' +
                    '  "webhookId": "6KQ4EmzqKowRgyBL65TwJg",\n' +
                    '  "originalDeliveryId": "PENf2czGBzTepjzSJdt6Nz",\n' +
                    '  "isRedelivery": false,\n' +
                    '  "type": "'+App.triggers.InvoiceProcessing.key+'",\n' +
                    '  "timestamp": 1623954207,\n' +
                    '  "storeId": "Hf9GvFK2dHJehm9J8A6kYfbc1ruc5jEZBKEr9r7jsrLo",\n' +
                    '  "invoiceId": "'+invoiceId+'"\n' +
                    '}' // Hard coded because it is used to calculate the "BTCPay-Sig"
            },
            cleanedRequest: {
                invoiceId: invoiceId,
            },
            inputData: {
                store_id: process.env.STORE_ID
            },
        };

        bundle.rawRequest.headers = {'Http-Btcpay-Sig': Util.calculateHash(bundle)};

        const results = await appTester(
            App.triggers.InvoiceProcessing.operation.perform,
            bundle
        );

        expect(results.length).toBe(1);
        const invoice = results[0];
        expect(invoice.id).toBe(invoiceId);
        expect(invoice.storeId).toBe(process.env.STORE_ID);
        expect(invoice.amount).toBeGreaterThan(0);
        expect(invoice.checkoutLink).toBeDefined();
    });

    test(App.triggers.InvoiceProcessing.key + ' list sample data', async () => {

        const z = {};

        const bundle = {
            authData: {
                server_url: process.env.SERVER_URL,
                store_id: process.env.STORE_ID,
                api_key: process.env.API_KEY
            },
            rawRequest: {},
            cleanedRequest: {},
            inputData: {
                store_id: process.env.STORE_ID
            },
        };

        const results = await appTester(
            App.triggers.InvoiceProcessing.operation.performList,
            bundle
        );

        expect(results.length).toBeGreaterThan(1);
        const invoice = results[0];

        expect(invoice.amount).toBeGreaterThan(0);
        expect(invoice.checkoutLink).toBeDefined();
    });
});