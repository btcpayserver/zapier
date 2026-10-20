/* globals describe, expect, test */

const zapier = require('zapier-platform-core');
const App = require('../../index');

const appTester = zapier.createAppTester(App);

zapier.tools.env.inject();

describe('triggers', () => {
    test(App.triggers.InvoiceSettled.key + ' subscribe and unsubscribe', async () => {
        const bundle = {
            authData: {
                server_url: process.env.SERVER_URL,
                api_key: process.env.API_KEY
            },
            targetUrl: 'https://hooks.zapier.com/hooks/standard/123456/abcdef/',
            inputData: {
                store_id: process.env.STORE_ID
            },
        };

        const subscribeData = await appTester(
            App.triggers.InvoiceSettled.operation.performSubscribe,
            bundle
        );

        expect(subscribeData.id).toBeDefined();
        expect(subscribeData.secret).toBeDefined();
        expect(subscribeData.storeId).toBe(process.env.STORE_ID);
        expect(subscribeData.url).toBe(bundle.targetUrl);
        expect(subscribeData.authorizedEvents.specificEvents).toEqual(['InvoiceSettled']);

        bundle.subscribeData = subscribeData;
        await appTester(App.triggers.InvoiceSettled.operation.performUnsubscribe, bundle);

        // The webhook is gone now. Turning off the Zap again must not fail.
        await appTester(App.triggers.InvoiceSettled.operation.performUnsubscribe, bundle);
    });
});
