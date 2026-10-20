const zapier = require('zapier-platform-core');
const App = require('../../index');
const appTester = zapier.createAppTester(App);

zapier.tools.env.inject();

const authData = {
    server_url: process.env.SERVER_URL,
    api_key: process.env.API_KEY
};

const createInvoice = function () {
    return appTester(App.creates.CreateInvoice.operation.perform, {
        authData: authData,
        inputData: {
            store_id: process.env.STORE_ID,
            amount: 1,
            currency_code: 'EUR',
        },
    });
};

describe('creates.invoice', () => {
    test(App.creates.MarkInvoiceInvalid.key, async () => {
            const invoice = await createInvoice();

            const invalidInvoice = await appTester(App.creates.MarkInvoiceInvalid.operation.perform, {
                authData: authData,
                inputData: {
                    store_id: invoice.storeId,
                    invoice_id: invoice.id
                },
            });

            expect(invalidInvoice).toBeDefined();
            expect(invalidInvoice.id).toBe(invoice.id);
            expect(invalidInvoice.storeId).toBe(process.env.STORE_ID);
            expect(invalidInvoice.status).toBe('Invalid');
        }
    );

    test(App.creates.MarkInvoiceComplete.key, async () => {
            const invoice = await createInvoice();

            const settledInvoice = await appTester(App.creates.MarkInvoiceComplete.operation.perform, {
                authData: authData,
                inputData: {
                    store_id: invoice.storeId,
                    invoice_id: invoice.id
                },
            });

            expect(settledInvoice.id).toBe(invoice.id);
            expect(settledInvoice.status).toBe('Settled');
            expect(settledInvoice.additionalStatus).toBe('Marked');
        }
    );
});
