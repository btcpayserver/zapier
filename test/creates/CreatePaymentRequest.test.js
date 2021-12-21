const zapier = require('zapier-platform-core');
const App = require('../../index');
const appTester = zapier.createAppTester(App);
const Util = require('../../common/Util');

zapier.tools.env.inject();

describe('creates.CreatePaymentRequest', () => {
    test(App.creates.CreatePaymentRequest.key, async () => {
            const email = Util.randomText(8) + '@example.com';
            const storeId = process.env.STORE_ID;

            const title = "Zapier Test Payment Request";
            const description = "My Description";
            const amount = 5;
            const currencyCode = "EUR";

            // TODO the unix timestamp does not work. Bug in BTCPay? See
            //const expiryDateUnixTimestamp = Math.floor((new Date().getTime()) / 1000) + (30*24*60*60);
            const expiryDateUnixTimestamp = null;

            const bundle = {
                authData: {
                    server_url: process.env.SERVER_URL,
                    api_key: process.env.API_KEY
                },
                rawRequest: {},
                inputData: {
                    store_id: storeId,
                    title: title,
                    description: description,
                    email: email,
                    amount: amount,
                    currency_code: currencyCode,
                    expiry_date: expiryDateUnixTimestamp,
                    embedded_css: "body: { background: red; }",
                    custom_css_link: null,
                    allow_custom_payment_amounts: false,
                },
            }

            const result = await appTester(App.creates.CreatePaymentRequest.operation.perform, bundle);

            expect(result).toBeDefined();

            expect(result.id).toBeDefined();
            expect(result.storeId).toBe(storeId);
            expect(result.amount).toBe(amount);
            expect(result.status).toBe('Pending');
            expect(result.email).toBe(email);
            expect(result.title).toBe(title);
            expect(result.description).toBe(description);
            expect(result.archived).toBeFalsy();
            expect(result.currency).toBe(currencyCode);

            // TODO check expiryDate in correct format
            // expect(result.expiryDate).toBeDefined();

            expect(result.createdTime).toBeDefined();
            expect(result.embeddedCSS).toBeDefined();
            expect(result.customCSSLink).toBeDefined();
            expect(result.allowCustomPaymentAmounts).toBeDefined();

            //console.log("Created Payment Request ID " + result.id + " in store ID " + storeId);
        }
    );
});
