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

describe('resources', () => {
    test(App.resources.store.key + ' resource', async () => {
        const invoiceId = process.env.INVOICE_ID;

        let bundle = {
            authData: {
                server_url: process.env.SERVER_URL,
                api_key: process.env.API_KEY
            },
            subscribeData: {
                secret: '5TjrCfkTgfjY4rJj85bTJj'
            }
        };

        // bundle.rawRequest.headers = {'Http-Btcpay-Sig': Util.calculateHash(bundle)};

        const results = await appTester(
            App.resources.store.list.operation.perform,
            bundle
        );

        const expectedStore = process.env.STORE_ID;

        expect(results.length).toBeGreaterThan(0);

        let foundStore = false;

        for(let i =0;i<results.length; i++){
            let store = results[i];

            expect(store.id).toBeDefined();
            expect(store.name).toBeDefined();
            expect(store.speedPolicy).toBeDefined();
            expect(store.invoiceExpiration).toBeGreaterThan(0);
            expect(store.monitoringExpiration).toBeGreaterThan(0);

            if(store.id ===expectedStore){
                foundStore = true;
            }
        }
        expect(foundStore).toBeTruthy();
    });
});