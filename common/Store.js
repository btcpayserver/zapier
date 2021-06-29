const Util = require('../common/functions');

module.exports = {
    noun: 'Store',
    getById: async function (z, bundle, storeId) {
        const options = {
            url: bundle.authData.server_url + '/api/v1/stores/' + storeId,
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
    //     "id": "VDdmfYJzJm9VtqW8hqhypF",
    //     "checkoutLink": ":censored:25:c3b580afa6:/i/VDdmfYJzJm9VtqW8hqhypF",
    //     "status": "Expired",
    //     "additionalStatus": "None",
    //     "createdTime": "2021-07-08T12:17:24.000Z",
    //     "expirationTime": "2021-07-08T12:32:24.000Z",
    //     "monitoringExpiration": "2021-07-08T13:17:24.000Z",
    //     "amount": 6.15,
    //     "currency": "EUR",
    //     "metadata": {},
    //     "checkout": {
    //         "speedPolicy": "MediumSpeed",
    //         "paymentMethods": ["BTC", "BTC-LightningNetwork"],
    //         "expirationMinutes": 15,
    //         "monitoringMinutes": 60,
    //         "paymentTolerance": 0.0,
    //         "redirectURL": null,
    //         "redirectAutomatically": false,
    //         "defaultLanguage": null
    //     }
    // }
}