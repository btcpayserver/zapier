const Util = require('../common/Util');
const Invoice = require('../common/Invoice');
const Payment = require('../common/Payment');
const Store = require('../common/Store');

const eventName = 'InvoiceReceivedPayment';

const performSubscribe = function (z, bundle) {
    return Util.performSubscribe(z, bundle, eventName);
}

let outputFields = Invoice.outputFields;
outputFields.push({
    key: 'trigger__receivedAfterExpiration',
    label: 'Payment received after expiration',
    type: 'boolean'
});

for(let i = 0; i < Payment.outputFields.length; i++){
    outputFields.push(Payment.outputFields[i]);
}

// TODO add all payment fields
// outputFields.push({
//     key: 'trigger__payment',
//     label: 'Payment received after expiration',
//     type: 'boolean'
// });

let sample = Invoice.sample;
sample.trigger = {
    receivedAfterExpiration: false,
    // TODO add payment sample
    payment: Invoice.paymentSample
};

module.exports = {
    operation: {
        perform: Invoice.performForOne,
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
        important: false,
    },
};
