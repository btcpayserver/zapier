const Util = require('./Util');

module.exports = {
    noun: 'Payment Request',

    // All payment requests of the store, archived ones included.
    getAll: async function (z, bundle, storeId) {
        const response = await z.request({
            url: bundle.authData.server_url + '/api/v1/stores/' + encodeURI(storeId) + '/payment-requests',
            method: 'GET',
            params: {includeArchived: true},
        });
        return response.data;
    },

    // Returns the payment request as BTCPay Server gives it, or null when the store has no payment request with this ID.
    getById: async function (z, bundle, storeId, paymentRequestId) {
        const response = await z.request({
            url: bundle.authData.server_url + '/api/v1/stores/' + encodeURI(storeId) + '/payment-requests/' + encodeURI(paymentRequestId),
            method: 'GET',
            skipThrowForStatus: true,
        });
        if (response.status < 400) {
            return response.data;
        }
        // BTCPay Server also answers "missing-permission" for an ID it does not know.
        // The list needs the same permission, so it throws when the key really lacks it.
        if (response.status === 404 || (response.data && response.data.code === 'missing-permission')) {
            const all = await this.getAll(z, bundle, storeId);
            return all.find((paymentRequest) => paymentRequest.id === paymentRequestId) || null;
        }
        Util.throwForStatus(z, response);
    },

    // A reference ID is unique within a store, archived payment requests included.
    getByReferenceId: async function (z, bundle, storeId, referenceId) {
        const all = await this.getAll(z, bundle, storeId);
        return all.find((paymentRequest) => paymentRequest.referenceId === referenceId) || null;
    },

    sample: {
        "status": "Pending",
        "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
        "storeId": "Hf9GvFK2dHJehm9J8A6kYfbc1ruc5jEZBKEr9r7jsrLo",
        "archived": false,
        "amount": 5,
        "currency": "EUR",
        "expiryDate": null,
        "title": "Sample Payment Request",
        "description": "My Description",
        "email": "sample@example.com",
        "referenceId": "INV-123493",
        "allowCustomPaymentAmounts": false,
        "createdTime": "2021-12-21T11:08:36.000Z"
    },

    outputFields: [
        {key: 'id', label: 'Payment Request ID', type: 'string'},
        {key: 'storeId', label: 'Store ID', type: 'string'},
        {key: 'amount', label: 'Amount', type: 'number'},
        {key: 'title', label: 'Title', type: 'string'},
        {key: 'description', label: 'Description', type: 'string'},
        {key: 'email', label: 'Email', type: 'string'},
        {key: 'status', label: 'Status', type: 'string'},
        {key: 'createdTime', label: 'Payment Request Created At', type: 'datetime'},
        {key: 'archived', label: 'Is Archived', type: 'boolean'},
        {key: 'currency', label: 'Currency', type: 'string'},
        {key: 'expiryDate', label: 'Payment Request Expiry Date', type: 'datetime'},
        {key: 'referenceId', label: 'Reference ID', type: 'string'},
        {key: 'allowCustomPaymentAmounts', label: 'Allow Custom Payment Amounts', type: 'boolean'},
    ],

    inputFields: {
        payment_request_id: {
            key: 'payment_request_id',
            label: 'Payment Request ID',
            type: 'string',
            required: true,
        },
        title: {
            key: 'title',
            label: 'Title',
            type: 'string',
            required: true,
        },
        email: {
            key: 'email',
            label: 'Email',
            type: 'string',
            helpText: 'The customer\'s email address.',
            required: false,
        },
        description: {
            key: 'description',
            label: 'Description',
            type: 'string',
            required: false,
        },
        expiry_date: {
            key: 'expiry_date',
            label: 'Expiry Date',
            type: 'datetime',
            required: false,
        },
        allow_custom_payment_amounts: {
            key: 'allow_custom_payment_amounts',
            label: 'Allow Custom Payment Amounts',
            helpText: "Whether to allow users to create invoices that partially pay the payment request.",
            type: 'boolean',
            required: false,
        },
        reference_id: {
            key: 'reference_id',
            label: 'Reference ID',
            type: 'string',
            helpText: 'Your own identifier for the payment request, like an invoice number from your accounting software. It must be unique within the store.',
            required: false,
        },
    },

    format: function (data) {
        data.amount = Number(data.amount);

        if(typeof data.createdTime === 'number') {
            data.createdTime = new Date(data.createdTime * 1000).toISOString();
        }
        if(typeof data.expiryDate === 'number') {
            data.expiryDate = new Date(data.expiryDate * 1000).toISOString();
        }

        return data;
    },

    // Zapier gives datetime fields as an ISO 8601 string, BTCPay Server wants a unix timestamp in seconds.
    toUnixTimestamp: function (z, value) {
        if (value === undefined || value === null || value === '') {
            return null;
        }
        const time = new Date(value).getTime();
        if (isNaN(time)) {
            throw new z.errors.Error('The expiry date "' + value + '" is not a valid date.', 'InvalidData', 400);
        }
        return Math.floor(time / 1000);
    }
}