const Util = require('../common/Util');
const Invoice = require('../common/Invoice');
const Payment = require('../common/Payment');
const Store = require('../common/Store');

const eventName = 'InvoiceReceivedPayment';

const performSubscribe = function (z, bundle) {
    return Util.performSubscribe(z, bundle, eventName);
}

// Copies, so the invoice fields and sample used by the other triggers stay unchanged.
const outputFields = Invoice.outputFields.concat(Payment.outputFields);
const sample = Object.assign({}, Invoice.sample, {trigger: Payment.sample});

module.exports = {
    operation: {
        perform: Payment.performForInvoicePayment,
        performList: Invoice.getSampleData,
        inputFields: [Store.inputFields.store_id],
        type: 'hook',
        performSubscribe: performSubscribe,
        outputFields: outputFields,
        performUnsubscribe: Util.performUnsubscribe,
        sample: sample
    },
    key: eventName,
    noun: Invoice.noun,
    display: {
        label: 'Payment Received',
        description: 'Triggers when a full or partial payment was received. The payment is not settled yet, meaning it does not have enough confirmations on the blockchain yet.',
        hidden: false,
    },
};
