const zapier = require('zapier-platform-core');
const App = require('../../index');
const appTester = zapier.createAppTester(App);
const Util = require('../../common/Util');

zapier.tools.env.inject();

const authData = {
    server_url: process.env.SERVER_URL,
    api_key: process.env.API_KEY
};

const update = function (inputData) {
    return appTester(App.creates.UpdatePaymentRequest.operation.perform, {
        authData: authData,
        inputData: {store_id: process.env.STORE_ID, ...inputData},
    });
};

describe('creates.UpdatePaymentRequest', () => {
    test(App.creates.UpdatePaymentRequest.key, async () => {
            const created = await appTester(App.creates.CreatePaymentRequest.operation.perform, {
                authData: authData,
                inputData: {
                    store_id: process.env.STORE_ID,
                    title: 'Zapier Test Payment Request',
                    description: 'My Description',
                    email: Util.randomText(8) + '@example.com',
                    amount: 5,
                    currency_code: 'EUR',
                    reference_id: 'ZAPIER-' + Util.randomText(10),
                    allow_custom_payment_amounts: true,
                },
            });

            const expiryDate = new Date(Math.floor(Date.now() / 1000 + 7 * 24 * 60 * 60) * 1000).toISOString();
            const referenceId = 'ZAPIER-' + Util.randomText(10);
            const result = await update({
                payment_request_id: created.id,
                title: 'Zapier Test Payment Request (updated)',
                amount: 7.5,
                expiry_date: expiryDate,
                reference_id: referenceId,
            });

            expect(result.id).toBe(created.id);
            expect(result.storeId).toBe(process.env.STORE_ID);
            expect(result.title).toBe('Zapier Test Payment Request (updated)');
            expect(result.amount).toBe(7.5);
            expect(result.expiryDate).toBe(expiryDate);
            expect(result.referenceId).toBe(referenceId);

            // The fields left empty keep their value.
            expect(result.description).toBe(created.description);
            expect(result.email).toBe(created.email);
            expect(result.currency).toBe('EUR');
            expect(result.allowCustomPaymentAmounts).toBe(true);
            expect(result.createdTime).toBe(created.createdTime);

            // Updating with only the ID changes nothing.
            const unchanged = await update({payment_request_id: created.id});
            expect(unchanged).toEqual(result);
        }
    );

    test(App.creates.UpdatePaymentRequest.key + ' that does not exist', async () => {
            await expect(update({payment_request_id: 'does-not-exist', title: 'x'}))
                .rejects.toThrow(/does-not-exist.*was not found in this store/);
        }
    );
});
