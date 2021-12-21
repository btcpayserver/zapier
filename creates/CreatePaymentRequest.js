const Invoice = require('../common/Invoice');
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
            expiryDate: bundle.inputData.expiry_date,
            embeddedCSS: bundle.inputData.embedded_css,
            customCSSLink: bundle.inputData.custom_css_url,
            allowCustomPaymentAmounts: bundle.inputData.allow_custom_payment_amounts,
        }
    };

    let response = await z.request(options);
    if (response.status === 200) {
        return PaymentRequest.format(response.json);
    } else if (response.status === 403) {
        throw new z.errors.Error('Forbidden. Invoice could not be created.', 'Forbidden', response.status);
    } else {
        let errorMsg = 'Error: ';
        for (let i = 0; i < response.json.length; i++) {
            errorMsg += response.json[i].message + ', ';
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
            {
                key: 'title',
                label: 'Title',
                type: 'string',
                required: true,
            },
            Util.inputFields.currency_code,
            {
                key: 'email',
                label: 'Email',
                type: 'string',
                helpText: 'The customer\'s email address.',
                required: false,
            },
            {
                key: 'description',
                label: 'Description',
                type: 'string',
                required: false,
            },
            {
                key: 'expiry_date',
                label: 'Expiry Date',
                type: 'datetime',
                required: false,
            },
            {
                key: 'embedded_css',
                label: 'Embedded CSS',
                helpText: "Custom CSS code for styling the payment request webpage.",
                type: 'string',
                required: false,
            },
            {
                key: 'custom_css_url',
                label: 'Custom CSS URL',
                helpText: "URL to your custom CSS for styling the payment request webpage.",
                type: 'string',
                required: false,
            },
            {
                key: 'allow_custom_payment_amounts',
                label: 'Allow Custom Payment Amounts',
                helpText: "Whether to allow users to create invoices that partially pay the payment request.",
                type: 'boolean',
                required: false,
            },

        ],
        sample: PaymentRequest.sample,
        outputFields: Invoice.outputFields,
    },
    key: 'CreatePaymentRequest',
    noun: PaymentRequest.noun,
    display: {
        label: 'Create Payment Request',
        description: 'Creates a Payment Request',
        hidden: false,
        important: true,
    },
};