const Util = require('../common/Util');
const Invoice = require('../common/Invoice');
const Store = require('../common/Store');

const eventName = 'InvoiceProcessing';

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
        label: 'Invoice Processing',
        description: 'Triggers when an invoice is fully paid, but doesn\'t have the required amount of confirmations on the blockchain yet according to your store\'s settings.',
        hidden: false,
        important: false,
    },
};
