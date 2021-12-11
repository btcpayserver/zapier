const Util = require('../common/Util');
const Invoice = require('../common/Invoice');
const Store = require('../common/Store');

const eventName = 'InvoiceSettled';

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
        label: 'Invoice Settled',
        description: 'Triggers when an invoice is fully paid and has enough confirmations on the blockchain according to your store\'s configuration, making the invoice settled.',
        hidden: false,
        important: true,
    },
};
