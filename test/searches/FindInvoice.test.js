/* globals describe, expect, test, it */

const zapier = require('zapier-platform-core');

// Use this to make test calls into your app:
const App = require('../../index');
const appTester = zapier.createAppTester(App);

zapier.tools.env.inject();

describe('searches.FindInvoice', () => {
  it(App.searches.FindInvoice.key, async () => {

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
        order_id: process.env.ORDER_ID
      },
    }

    const results = await appTester(App.searches.FindInvoice.operation.perform, bundle);

    expect(results).toBeDefined();
    expect(results.length).toBe(1);

    const invoice = results[0];

    expect(invoice.id).toBeDefined();
    expect(invoice.storeId).toBe(process.env.STORE_ID);
    expect(invoice.amount).toBeGreaterThan(0);
    expect(invoice.checkoutLink).toBeDefined();
  });
});
