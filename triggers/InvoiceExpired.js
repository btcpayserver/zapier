const Util = require('../common/Util');
const Invoice = require('../common/Invoice');
const Store = require('../common/Store');

const eventName = 'InvoiceExpired';

const performSubscribe = function (z, bundle) {
    return Util.performSubscribe(z, bundle, eventName);
}

module.exports = {
    operation: {
        perform: Invoice.performForOne,
        performList: Invoice.getSampleData,
        inputFields: [Store.inputFields.store_id],
        type: 'hook',
        performSubscribe: performSubscribe,
        outputFields: Invoice.outputFields,
        performUnsubscribe: Util.performUnsubscribe,
        sample: Invoice.sample
    },
    key: eventName,
    noun: Invoice.noun,
    display: {
        label: 'Invoice Expired',
        description: 'Triggers when an invoice expires, meaning the customer did not pay in the time he or she was supposed to.',
        hidden: false,
        important: true,
    },
};
