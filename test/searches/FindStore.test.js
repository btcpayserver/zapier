/* globals describe, expect, test, it */

const zapier = require('zapier-platform-core');

// Use this to make test calls into your app:
const App = require('../../index');
const appTester = zapier.createAppTester(App);

zapier.tools.env.inject();

describe('searches.FindStore', () => {
  it(App.searches.FindStore.key, async () => {

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
        store_id: process.env.STORE_ID
      },
    }

    const results = await appTester(App.searches.FindStore.operation.perform, bundle);

    expect(results).toBeDefined();
    expect(results.length).toBe(1);

    const store = results[0];

    expect(store.id).toBe(process.env.STORE_ID);
    expect(store.name).toBeDefined();
    expect(store.invoiceExpiration).toBeGreaterThan(0);
    expect(store.monitoringExpiration).toBeGreaterThan(0);

    // TODO test for more fields
    //             "website": "store.org",
    //             "invoiceExpiration": 900,
    //             "monitoringExpiration": 3600,
    //             "speedPolicy": "MediumSpeed",
    //             "lightningDescriptionTemplate": "Paid to {StoreName} (Order ID: {OrderId})",
    //             "paymentTolerance": 0,
    //             "anyoneCanCreateInvoice": false,
    //             "requiresRefundEmail": true,
    //             "lightningAmountInSatoshi": false,
    //             "lightningPrivateRouteHints": false,
    //             "onChainWithLnInvoiceFallback": false,
    //             "lazyPaymentMethods": false,
    //             "redirectAutomatically": false,
    //             "showRecommendedFee": true,
    //             "recommendedFeeBlockTarget": 1,
    //             "defaultPaymentMethod": "BTC",
    //             "defaultLang": "nl-NL",
    //             "customLogo": null,
    //             "customCSS": null,
    //             "htmlTitle": null,
    //             "networkFeeMode": "MultiplePaymentsOnly",
    //             "payJoinEnabled": true

  });
});
