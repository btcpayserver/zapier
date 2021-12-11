const zapier = require('zapier-platform-core');
const App = require('../../index');
const appTester = zapier.createAppTester(App);

zapier.tools.env.inject();

describe('creates.invoice', () => {
    test(App.creates.CreateInvoice.key, async () => {
            const amount = 1 + Math.floor(Math.random() * 100);
            const currencyCode = 'EUR';
            const orderId = process.env.ZAPIER_ORDER;
            const buyerName = 'Wouter';

            const bundle = {
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
                },
                inputData: {
                    store_id: process.env.STORE_ID,
                    amount: amount,
                    currency_code: currencyCode,
                    order_id: orderId,
                    buyer_name: buyerName,
                    buyer_email: 'zapiertest@btcpayserver.org',
                    buyer_country: 'BE',
                    buyer_zip: '1000',
                    buyer_state: 'Happy State',
                    buyer_city: "Test City",
                    buyer_address1: 'Test street line 1',
                    buyer_address2: 'Test street line 2',
                    buyer_phone: '123 456 789'
                },
            }

            const invoice = await appTester(App.creates.CreateInvoice.operation.perform, bundle);

            expect(invoice).toBeDefined();
            expect(invoice.id).toBeDefined();
            expect(invoice.checkoutLink).toBeDefined();
            expect(invoice.status).toBe('New');
            expect(invoice.additionalStatus).toBe('None');
            expect(invoice.monitoringExpiration).toBeDefined();
            expect(invoice.expirationTime).toBeDefined();
            expect(invoice.createdTime).toBeDefined();
            expect(invoice.amount).toBe(amount);
            expect(invoice.currency).toBe(currencyCode);
            expect(invoice.metadata.orderId).toBe(orderId);
            expect(invoice.metadata.buyerName).toBe(buyerName);
            expect(invoice.metadata.buyerEmail).toBe('zapiertest@btcpayserver.org');
            expect(invoice.metadata.buyerCountry).toBe('BE');
            expect(invoice.metadata.buyerZip).toBe('1000');
            expect(invoice.metadata.buyerState).toBe('Happy State');
            expect(invoice.metadata.buyerCity).toBe("Test City");
            expect(invoice.metadata.buyerAddress1).toBe('Test street line 1');
            expect(invoice.metadata.buyerAddress2).toBe('Test street line 2');
            expect(invoice.metadata.buyerPhone).toBe('123 456 789');
        }
    );
});
