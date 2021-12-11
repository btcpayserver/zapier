const zapier = require('zapier-platform-core');
const App = require('../../index');
const Invoice = require('../../common/Invoice');
const appTester = zapier.createAppTester(App);

zapier.tools.env.inject();

describe('creates.invoice', () => {
    test(App.creates.MarkInvoiceInvalid.key, async () => {
            let bundle = {
                authData: {
                    server_url: process.env.SERVER_URL,
                    api_key: process.env.API_KEY
                },
                rawRequest: {
                    headers: {
                        'Http-Btcpay-Sig': 'sha256=4ec27a6ca16dbc7b8c7ddfb5654b1f8dbf8c69a439e970fd2bfac6e19713f211'
                    },
                    content: '{\n' +
                        '  "deliveryId": "PENf2czGBzTepjzSJdt6Nz",\n' +
                        '  "webhookId": "6KQ4EmzqKowRgyBL65TwJg",\n' +
                        '  "originalDeliveryId": "PENf2czGBzTepjzSJdt6Nz",\n' +
                        '  "isRedelivery": false,\n' +
                        '  "type": "InvoiceCreated",\n' +
                        '  "timestamp": 1623954207,\n' +
                        '  "storeId": "Hf9GvFK2dHJehm9J8A6kYfbc1ruc5jEZBKEr9r7jsrLo",\n' +
                        '  "invoiceId": "CQZj4Qbm475EJQ5HsWeAbd"\n' +
                        '}' // Hard coded because it is used to calculate the "BTCPay-Sig"
                }
            }

            // TODO we need access to "z"

        // 1. Prepare a new invoice to run the test on
        const invoice = await Invoice.create(
            z,
            process.env.SERVER_URL,
            process.env.STORE_ID,
            1,
            'EUR',
        );

        // 2. Set the inputs so we can run
        bundle.inputData = {
            store_id: invoice.storeId,
            invoice_id: invoice.id
        };


            const invalidInvoice = await appTester(perform, bundle);

            expect(invalidInvoice).toBeDefined();
            expect(invalidInvoice.id).toBeDefined();
            expect(invalidInvoice.storeId).toBe(process.env.STORE_ID);
            expect(invalidInvoice.status).toBe('Invalid');
        }
    );
});

