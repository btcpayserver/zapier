const Store = require('../common/Store');
const Util = require('../common/Util');
const PaymentRequest = require('../common/PaymentRequest');

const createPaymentRequest = async function (z, bundle) {
    const serverUrl = bundle.authData.server_url;
    const storeId = bundle.inputData.store_id;

    const options = {
        url: serverUrl + '/api/v1/stores/' + encodeURI(storeId) + '/payment-requests/',
        method: 'POST',
        params: {},
        body: {
            amount: bundle.inputData.amount,
            title: bundle.inputData.title,
            currency: bundle.inputData.currency_code,
            email: bundle.inputData.email,
            description: bundle.inputData.description,
            expiryDate: PaymentRequest.toUnixTimestamp(z, bundle.inputData.expiry_date),
            allowCustomPaymentAmounts: bundle.inputData.allow_custom_payment_amounts,
            referenceId: bundle.inputData.reference_id,
        }
    };

    let response = await z.request(options);
    if (response.status === 200) {
        return PaymentRequest.format(response.data);
    } else if (response.status === 403) {
        throw new z.errors.Error('Forbidden. Payment request could not be created.', 'Forbidden', response.status);
    } else {
        let errorMsg = 'Error: ';
        for (let i = 0; i < response.data.length; i++) {
            errorMsg += response.data[i].message + ', ';
        }
        throw new z.errors.Error(errorMsg, 'InvalidData', response.status);
    }
}


module.exports = {
    operation: {
        perform: createPaymentRequest,
        inputFields: [
            Store.inputFields.store_id,
            Util.inputFields.amount,
            PaymentRequest.inputFields.title,
            Util.inputFields.currency_code,
            PaymentRequest.inputFields.email,
            PaymentRequest.inputFields.description,
            PaymentRequest.inputFields.expiry_date,
            PaymentRequest.inputFields.allow_custom_payment_amounts,
            PaymentRequest.inputFields.reference_id,
        ],
        sample: PaymentRequest.sample,
        outputFields: PaymentRequest.outputFields,
    },
    key: 'CreatePaymentRequest',
    noun: PaymentRequest.noun,
    display: {
        label: 'Create Payment Request',
        description: 'Creates a Payment Request',
        hidden: false,
    },
};