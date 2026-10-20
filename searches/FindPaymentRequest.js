const PaymentRequest = require('../common/PaymentRequest');
const Store = require('../common/Store');

const perform = async (z, bundle) => {
    const storeId = bundle.inputData.store_id;
    let paymentRequest;
    if (bundle.inputData.payment_request_id) {
        paymentRequest = await PaymentRequest.getById(z, bundle, storeId, bundle.inputData.payment_request_id);
    } else if (bundle.inputData.reference_id) {
        paymentRequest = await PaymentRequest.getByReferenceId(z, bundle, storeId, bundle.inputData.reference_id);
    } else {
        throw new z.errors.Error('Enter a Payment Request ID or a Reference ID.', 'InvalidData', 400);
    }

    if (paymentRequest) {
        return [PaymentRequest.format(paymentRequest)];
    } else {
        return [];
    }
};

module.exports = {
    // see here for a full list of available properties:
    // https://github.com/zapier/zapier-platform/blob/master/packages/schema/docs/build/schema.md#searchschema
    key: 'FindPaymentRequest',
    noun: PaymentRequest.noun,

    display: {
        label: 'Find Payment Request',
        description: 'Finds a payment request by its ID or reference ID and gets the details.',
        hidden: false,
    },

    operation: {
        perform,
        inputFields: [
            Store.inputFields.store_id,
            {
                ...PaymentRequest.inputFields.payment_request_id,
                required: false,
                helpText: 'Search by the ID BTCPay Server gave the payment request. If you fill in both fields, only this one is used.',
            },
            {
                ...PaymentRequest.inputFields.reference_id,
                helpText: 'Search by your own reference ID for the payment request.',
            },
        ],
        sample: PaymentRequest.sample,
        outputFields: PaymentRequest.outputFields,
    }
};
