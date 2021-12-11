module.exports = {
    noun: 'Store',

    getById: async function (z, bundle, storeId) {
        const options = {
            url: bundle.authData.server_url + '/api/v1/stores/' + encodeURI(storeId),
            method: 'GET',
            params: {},
            body: {},
        };

        let response = await z.request(options);
        if (response.status === 200) {
            return this.format(response.json);
        } else {
            throw new z.errors.Error('Invoice could not be found.', 'NotFound', 404);
        }
    },

    format: function (store) {
        // invoice.amount = Number(invoice.amount);
        // invoice.monitoringExpiration = new Date(invoice.monitoringExpiration * 1000).toISOString();
        // invoice.expirationTime = new Date(invoice.expirationTime * 1000).toISOString();
        // invoice.createdTime = new Date(invoice.createdTime * 1000).toISOString();
        return store;
    },

    inputFields:{
        store_id: {
            key: 'store_id',
            label: 'Store',
            type: 'string',
            required: true,
            list: false,
            altersDynamicFields: false,
            helpText: 'The BTCPay Server store that contains the invoice.',
            dynamic: 'storeList.id.name' // Meaning: resource "store" with method "list". The value is in the "id" field and the label is in the "name" field.
        }
    },

    getAll: function (z, bundle) {
        // Used for testing and setup. Just return the latest invoice in the same format as you'd normally get (see: perform() method).
        const options = {
            url: bundle.authData.server_url + '/api/v1/stores/',
            method: 'GET',
            params: {},
            body: {},
        };

        return z.request(options).then((response) => {
            let results = response.json;

            for (let i = 0; i < results.length; i++) {
                results[i] = module.exports.format(results[i]);
            }
            return results;
        });
    },

    outputFields: [
        {key: 'id', label: 'Store ID', type: 'string'},
        {key: 'name', label: 'Store Name', type: 'string'}
    ],
    // sample: {
    //   "id": "Hf9GvFK2dHJehm9J8A6kYfbc1ruc5jEZBKEr9r7jsrLo",
    //   "name": "Storefront",
    //   "website": "storefront.be",
    //   "invoiceExpiration": 900,
    //   "monitoringExpiration": 3600,
    //   "speedPolicy": "MediumSpeed",
    //   "lightningDescriptionTemplate": "Paid to {StoreName} (Order ID: {OrderId})",
    //   "paymentTolerance": 0,
    //   "anyoneCanCreateInvoice": false,
    //   "requiresRefundEmail": true,
    //   "lightningAmountInSatoshi": false,
    //   "lightningPrivateRouteHints": false,
    //   "onChainWithLnInvoiceFallback": false,
    //   "lazyPaymentMethods": false,
    //   "redirectAutomatically": false,
    //   "showRecommendedFee": true,
    //   "recommendedFeeBlockTarget": 1,
    //   "defaultPaymentMethod": "BTC",
    //   "defaultLang": "nl-NL",
    //   "customLogo": null,
    //   "customCSS": null,
    //   "htmlTitle": null,
    //   "networkFeeMode": "MultiplePaymentsOnly",
    //   "payJoinEnabled": true
    // }
}