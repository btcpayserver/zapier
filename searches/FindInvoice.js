const Invoice = require('../common/Invoice');
const Store = require('../common/Store');

const perform = async (z, bundle) => {
    const response = await z.request({
        url: bundle.authData.server_url + '/api/v1/stores/' + bundle.inputData.store_id + '/invoices',
        params: {'orderId[]': bundle.inputData.order_id},
    });

    if (response.json.length > 0) {
        return [Invoice.format(response.json[0], bundle.inputData.store_id)];
    } else {
        return [];
    }
};

module.exports = {
    // see here for a full list of available properties:
    // https://github.com/zapier/zapier-platform/blob/master/packages/schema/docs/build/schema.md#searchschema
    key: 'FindInvoice',
    noun: Invoice.noun,

    display: {
        label: 'Find Invoice by Order ID',
        description: 'Finds an Invoice for a given order.',
        hidden: false,
        important: false,
    },

    operation: {
        perform,
        inputFields: [
            Store.inputFields.store_id,
            {
                key: 'order_id',
                label: 'Order ID',
                type: 'string',
                helpText: 'Search for an invoice by the given Order ID.',
                required: true,
                list: false,
                altersDynamicFields: false,
            },
        ],
        sample: {
            id: 'VDdmfYJzJm9VtqW8hqhypF',
            checkoutLink: 'https://mybtcpayserver.com/i/VDdmfYJzJm9VtqW8hqhypF',
            status: 'Expired',
            additionalStatus: 'None',
            createdTime: "2021-07-08T12:17:24.000Z",
            expirationTime: "2021-07-08T12:32:24.000Z",
            monitoringExpiration: "2021-07-08T13:17:24.000Z",
            amount: 7.0,
            currency: 'EUR',
            metadata: {},
            checkout: {
                speedPolicy: 'MediumSpeed',
                paymentMethods: ['BTC', 'BTC-LightningNetwork'],
                expirationMinutes: 15,
                monitoringMinutes: 60,
                paymentTolerance: 0,
                redirectURL: null,
                redirectAutomatically: false,
                defaultLanguage: null,
            },
        },
        outputFields: Invoice.outputFields

    }
};
