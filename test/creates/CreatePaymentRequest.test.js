const zapier = require('zapier-platform-core');
const App = require('../../index');
const appTester = zapier.createAppTester(App);
const Util = require('../../common/Util');

zapier.tools.env.inject();

describe('creates.CreatePaymentRequest', () => {
    test(App.creates.CreatePaymentRequest.key, async () => {
            // const email = Util.randomText(8) + '@example.com';
            // const password = Util.randomText(8);
            // const isAdministrator = false;

            const bundle = {
                authData: {
                    server_url: process.env.SERVER_URL,
                    api_key: process.env.API_KEY
                },
                rawRequest: {},
                inputData: {
                    email: email,
                    password: password,
                    is_administrator: isAdministrator
                },
            }

            const result = await appTester(App.creates.CreatePaymentRequest.operation.perform, bundle);

            expect(result).toBeDefined();
            expect(rresult.id).toBeDefined();
            // expect(user.email).toBeDefined();
            // expect(user.emailConfirmed).toBeDefined();
            // expect(user.requiresEmailConfirmation).toBeDefined();
            // expect(user.created).toBeDefined();
            // expect(user.roles).toBeDefined();
        }
    );
});
