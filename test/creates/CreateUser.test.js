const zapier = require('zapier-platform-core');
const App = require('../../index');
const appTester = zapier.createAppTester(App);
const Util = require('../../common/Util');

zapier.tools.env.inject();

describe('creates.CreateUser', () => {
    test(App.creates.CreateUser.key, async () => {
            const email = Util.randomText(8) + '@example.com';
            const name = 'Zapier Test User';
            const isAdministrator = false;

            const bundle = {
                authData: {
                    server_url: process.env.SERVER_URL,
                    api_key: process.env.API_KEY
                },
                rawRequest: {},
                inputData: {
                    email: email,
                    name: name,
                    is_administrator: isAdministrator,
                    // A test server may not have email settings.
                    send_invitation_email: false
                },
            }

            const user = await appTester(App.creates.CreateUser.operation.perform, bundle);

            //{key: 'id', label: 'User ID', type: 'string'},
            //         {key: 'email', label: 'Email', type: 'string'},
            //         {key: 'emailConfirmed', label: 'Email Confirmed', type: 'boolean'},
            //         {key: 'requiresEmailConfirmation', label: 'Requires Email Confirmation', type: 'boolean'},
            //         {key: 'created', label: 'Creation Unix Timestamp', type: 'integer'},
            //         {key: 'roles[]'

            expect(user).toBeDefined();
            expect(user.id).toBeDefined();
            expect(user.email).toBe(email);
            expect(user.name).toBe(name);
            expect(user.emailConfirmed).toBeDefined();
            expect(user.requiresEmailConfirmation).toBeDefined();
            expect(user.created).toBeDefined();
            expect(user.roles).toBeDefined();
            // Without a password, BTCPay Server gives an invitation link to set one.
            expect(user.invitationUrl).toContain('/invite/');
        }
    );
});
