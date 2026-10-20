const Store = require('../common/Store');
const Util = require('../common/Util');
const PaymentRequest = require('../common/PaymentRequest');

const isEmpty = (value) => value === undefined || value === null || value === '';

const updatePaymentRequest = async function (z, bundle) {
    const storeId = bundle.inputData.store_id;
    const paymentRequestId = bundle.inputData.payment_request_id;
    const input = bundle.inputData;

    const current = await PaymentRequest.getById(z, bundle, storeId, paymentRequestId);
    if (!current) {
        throw new z.errors.Error('The payment request "' + paymentRequestId + '" was not found in this store.', 'NotFound', 404);
    }

    // BTCPay Server replaces the whole payment request, so a field left empty keeps its current value.
    const keep = (value, currentValue) => isEmpty(value) ? currentValue : value;

    const response = await z.request({
        url: bundle.authData.server_url + '/api/v1/stores/' + encodeURI(storeId) + '/payment-requests/' + encodeURI(paymentRequestId),
        method: 'PUT',
        body: {
            title: keep(input.title, current.title),
            amount: keep(input.amount, current.amount),
            currency: keep(input.currency_code, current.currency),
            email: keep(input.email, current.email),
            description: keep(input.description, current.description),
            expiryDate: isEmpty(input.expiry_date) ? current.expiryDate : PaymentRequest.toUnixTimestamp(z, input.expiry_date),
            allowCustomPaymentAmounts: keep(input.allow_custom_payment_amounts, current.allowCustomPaymentAmounts),
            referenceId: keep(input.reference_id, current.referenceId),
            formId: current.formId,
        },
    });
    return PaymentRequest.format(response.data);
};

// The same field as when creating, but optional.
const optional = (field, helpText) => ({
    ...field,
    required: false,
    helpText: [helpText || field.helpText, 'Leave empty to keep the current value.'].filter(Boolean).join(' '),
});

module.exports = {
    operation: {
        perform: updatePaymentRequest,
        inputFields: [
            Store.inputFields.store_id,
            {
                ...PaymentRequest.inputFields.payment_request_id,
                helpText: 'The payment request to update.',
            },
            optional(PaymentRequest.inputFields.title),
            optional(Util.inputFields.amount, 'Cannot change once the payment request has invoices.'),
            optional(Util.inputFields.currency_code, 'The currency code, like USD, EUR or BTC. Cannot change once the payment request has invoices.'),
            optional(PaymentRequest.inputFields.email),
            optional(PaymentRequest.inputFields.description),
            optional(PaymentRequest.inputFields.expiry_date),
            optional(PaymentRequest.inputFields.allow_custom_payment_amounts),
            optional(PaymentRequest.inputFields.reference_id),
        ],
        sample: PaymentRequest.sample,
        outputFields: PaymentRequest.outputFields,
    },
    key: 'UpdatePaymentRequest',
    noun: PaymentRequest.noun,
    display: {
        label: 'Update Payment Request',
        description: 'Updates a Payment Request',
        hidden: false,
    },
};
