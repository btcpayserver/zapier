const zapier = require('zapier-platform-core');
const App = require('../../index');
const appTester = zapier.createAppTester(App);
const Util = require('../../common/Util');

zapier.tools.env.inject();

const authData = {
    server_url: process.env.SERVER_URL,
    api_key: process.env.API_KEY
};

const find = function (inputData) {
    return appTester(App.searches.FindPaymentRequest.operation.perform, {
        authData: authData,
        inputData: {store_id: process.env.STORE_ID, ...inputData},
    });
};

describe('searches.FindPaymentRequest', () => {
    let created;

    beforeAll(async () => {
        created = await appTester(App.creates.CreatePaymentRequest.operation.perform, {
            authData: authData,
            inputData: {
                store_id: process.env.STORE_ID,
                title: 'Zapier Test Payment Request',
                amount: 5,
                currency_code: 'EUR',
                reference_id: 'ZAPIER-' + Util.randomText(10),
            },
        });
    });

    it('by ID', async () => {
        const results = await find({payment_request_id: created.id});

        expect(results.length).toBe(1);
        expect(results[0].id).toBe(created.id);
        expect(results[0].storeId).toBe(process.env.STORE_ID);
        expect(results[0].title).toBe('Zapier Test Payment Request');
        expect(results[0].amount).toBe(5);
        expect(results[0].referenceId).toBe(created.referenceId);
        expect(results[0].createdTime).toBe(created.createdTime);
    });

    it('by reference ID', async () => {
        const results = await find({reference_id: created.referenceId});

        expect(results.length).toBe(1);
        expect(results[0].id).toBe(created.id);
    });

    it('without a match', async () => {
        expect(await find({payment_request_id: 'does-not-exist'})).toEqual([]);
        expect(await find({reference_id: 'ZAPIER-DOES-NOT-EXIST'})).toEqual([]);
    });

    it('without an ID or reference ID', async () => {
        await expect(find({})).rejects.toThrow('Enter a Payment Request ID or a Reference ID.');
    });

    // Needs an API key for the store without "btcpay.store.canviewpaymentrequests", so it only runs when LIMITED_API_KEY is set.
    const itIfLimitedKey = process.env.LIMITED_API_KEY ? it : it.skip;

    itIfLimitedKey('with a key that lacks the permission', async () => {
        // BTCPay Server gives the same error for an unknown ID, but a missing permission must not look like "nothing found".
        const search = appTester(App.searches.FindPaymentRequest.operation.perform, {
            authData: {server_url: process.env.SERVER_URL, api_key: process.env.LIMITED_API_KEY},
            inputData: {store_id: process.env.STORE_ID, payment_request_id: created.id},
        });

        await expect(search).rejects.toThrow('btcpay.store.canviewpaymentrequests');
    });
});
