const Util = require('../common/Util');
const Invoice = require('../common/Invoice');
const Payment = require('../common/Payment');
const Store = require('../common/Store');

const eventName = 'InvoicePaymentSettled';

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
        label: 'Invoice Payment Settled',
        description: 'Triggers when a (potentially partial) payment related to an invoice has enough confirmations on the blockchain according to your store\'s configuration, making the payment final.',
        hidden: false,
    },
};
