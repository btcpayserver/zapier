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
    test(App.triggers.InvoicePaymentSettled.key + ' webhook', async () => {

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
                // A payload as sent by BTCPay Server 2.x. Hard coded because it is used to calculate the "BTCPay-Sig".
                content: JSON.stringify({
                    afterExpiration: false,
                    paymentMethodId: 'BTC-CHAIN',
                    payment: {
                        id: '523d18e95b173bf5818a64615b548cf577529b2b9f1db2a4bc5bfeadffb2b007-0',
                        receivedDate: 1792499889,
                        value: '0.00003446',
                        fee: '0',
                        status: 'Settled',
                        destination: 'bcrt1q5hlwyh04kp2kz68juw3z8avnu2wr0a29425ua2'
                    },
                    deliveryId: 'NXhSx3j97Aqndo49N85U73',
                    webhookId: 'LZVfsb2u7n5wpGbF7WkRG4',
                    originalDeliveryId: 'NXhSx3j97Aqndo49N85U73',
                    isRedelivery: false,
                    type: App.triggers.InvoicePaymentSettled.key,
                    timestamp: 1792499889,
                    storeId: process.env.STORE_ID,
                    invoiceId: invoiceId,
                    metadata: {}
                })
            },
            inputData: {
                store_id: process.env.STORE_ID
            },
        };

        bundle.cleanedRequest = JSON.parse(bundle.rawRequest.content);
        bundle.rawRequest.headers = {'Http-Btcpay-Sig': Util.calculateHash(bundle)};

        const results = await appTester(
            App.triggers.InvoicePaymentSettled.operation.perform,
            bundle
        );

        expect(results.length).toBe(1);
        const invoice = results[0];
        expect(invoice.id).toBe(invoiceId);
        expect(invoice.storeId).toBe(process.env.STORE_ID);
        expect(invoice.amount).toBeGreaterThan(0);
        expect(invoice.checkoutLink).toBeDefined();

        expect(invoice.trigger.receivedAfterExpiration).toBe(false);
        expect(invoice.trigger.paymentMethodId).toBe('BTC-CHAIN');
        expect(invoice.trigger.payment.value).toBe(0.00003446);
        expect(invoice.trigger.payment.fee).toBe(0);
        expect(invoice.trigger.payment.status).toBe('Settled');
        expect(invoice.trigger.payment.receivedDate).toBe('2026-10-20T12:38:09.000Z');
    });

    test(App.triggers.InvoicePaymentSettled.key + ' list sample data', async () => {

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
            App.triggers.InvoicePaymentSettled.operation.performList,
            bundle
        );

        expect(results.length).toBeGreaterThan(1);
        const invoice = results[0];

        expect(invoice.amount).toBeGreaterThan(0);
        expect(invoice.checkoutLink).toBeDefined();
    });
});