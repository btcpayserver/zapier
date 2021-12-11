const Util = require('../common/Util');
const Invoice = require('../common/Invoice');
const Store = require('../common/Store');

const eventName = 'InvoiceReceivedPayment';

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
        label: 'Payment Received',
        description: 'Triggers when a full or partial payment was received. The payment is not settled yet, meaning it does not have enough confirmations on the blockchain yet.',
        hidden: false,
        important: false,
    },
};
