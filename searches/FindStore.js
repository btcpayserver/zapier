const Store = require('../common/Store');

const perform = async (z, bundle) => {
    // const response = await z.request({
    //     url: bundle.authData.server_url + '/api/v1/stores/' + bundle.inputData.store_id,
    //     params: {},
    // });

    const store = await Store.getById(z, bundle, bundle.inputData.store_id);

    if (store) {
        return [store];
    } else {
        return [];
    }
};

module.exports = {
    // see here for a full list of available properties:
    // https://github.com/zapier/zapier-platform/blob/master/packages/schema/docs/build/schema.md#searchschema
    key: 'FindStore',
    noun: Store.noun,

    display: {
        label: 'Get Store Details',
        description: 'Finds a Store for a given ID and get the details.',
        hidden: false,
        important: false,
    },

    operation: {
        perform,
        inputFields: [
            Store.inputFields.store_id
        ],
        sample: {
            "id": "Hf9GvFK2dHJehm9J8A6kYfbc1ruc5jEZBKEr9r7jsrLo",
            "name": "My Store",
            "website": "store.org",
            "invoiceExpiration": 900,
            "monitoringExpiration": 3600,
            "speedPolicy": "MediumSpeed",
            "lightningDescriptionTemplate": "Paid to {StoreName} (Order ID: {OrderId})",
            "paymentTolerance": 0,
            "anyoneCanCreateInvoice": false,
            "requiresRefundEmail": true,
            "lightningAmountInSatoshi": false,
            "lightningPrivateRouteHints": false,
            "onChainWithLnInvoiceFallback": false,
            "lazyPaymentMethods": false,
            "redirectAutomatically": false,
            "showRecommendedFee": true,
            "recommendedFeeBlockTarget": 1,
            "defaultPaymentMethod": "BTC",
            "defaultLang": "nl-NL",
            "customLogo": null,
            "customCSS": null,
            "htmlTitle": null,
            "networkFeeMode": "MultiplePaymentsOnly",
            "payJoinEnabled": true
        },
        outputFields: Store.outputFields

    }
};
