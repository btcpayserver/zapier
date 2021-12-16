const Util = require('../common/Util');
const Invoice = require('../common/Invoice');
const Store = require('../common/Store');

const eventName = 'InvoicePaymentSettled';

const performSubscribe = function (z, bundle) {
    return Util.performSubscribe(z, bundle, eventName);
}

// TODO add afterExpiration + payment, just like in InvoiceReceivedPayment

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
        label: 'Invoice Payment Settled',
        description: 'Triggers when a (potentially partial) payment related to an invoice has enough confirmations on the blockchain according to your store\'s configuration, making the payment final.',
        hidden: false,
        important: false,
    },
};
