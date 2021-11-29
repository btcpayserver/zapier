const Invoice = require('../common/Invoice');
const Store = require('../common/Store');

const markInvoiceSettled = function (z, bundle) {
    return Invoice.setStatus(z, bundle, bundle.inputData.invoice_id, 'Settled');
}

module.exports = {
    operation: {
        perform: markInvoiceSettled,
        inputFields: [
            Store.inputFields.store_id,
            {
                key: 'invoice_id',
                label: 'Invoice ID',
                type: 'string',
                helpText: 'The invoice to mark as complete.',
                required: true
            },
        ],
        sample: {
            id: 'VDdmfYJzJm9VtqW8hqhypF',
            checkoutLink: 'https://mybtcpayserver.com/i/VDdmfYJzJm9VtqW8hqhypF',
            status: 'Complete',
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
        outputFields: Invoice.outputFields,
    },
    key: 'MarkInvoiceComplete',
    noun: Invoice.noun,
    display: {
        label: 'Mark Invoice Settled',
        description: 'Marks an invoice as settled',
        important: false,
    },
};
