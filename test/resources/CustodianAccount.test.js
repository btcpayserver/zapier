const zapier = require('zapier-platform-core');

const App = require('../../index');
const Util = require('../../common/Util');

const appTester = zapier.createAppTester(App);

zapier.tools.env.inject();

describe('resources', () => {
    test(App.resources.custodian_account.key + ' resource', async () => {
        let bundle = {
            authData: {
                server_url: process.env.SERVER_URL,
                api_key: process.env.API_KEY
            },
            subscribeData: {
                secret: '5TjrCfkTgfjY4rJj85bTJj'
            },
            inputData:{
                store_id: process.env.STORE_ID
            }
        };

        const results = await appTester(
            App.resources.custodian_account.list.operation.perform,
            bundle
        );

        expect(results.length).toBeGreaterThan(0);

        let found = false;

        for(let i =0;i<results.length; i++){
            let account = results[i];

            expect(account.id).toBeDefined();
            expect(account.name).toBeDefined();
            expect(account.custodianCode).toBeDefined();
            expect(account.storeId).toBe(process.env.STORE_ID);

            if(account.id === process.env.CUSTODIAN_ACCOUNT_ID){
                found = true;
            }
        }
        expect(found).toBeTruthy();
    });
});