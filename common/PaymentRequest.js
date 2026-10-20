module.exports = {
    noun: 'Payment Request',

    sample: {
        "status": "Pending",
        "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
        "archived": false,
        "amount": 5,
        "currency": "EUR",
        "expiryDate": null,
        "title": "Sample Payment Request",
        "description": "My Description",
        "email": "sample@example.com",
        "referenceId": null,
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
        {key: 'archived', label: 'Is Achived', type: 'boolean'},
        {key: 'currency', label: 'Currency', type: 'string'},
        {key: 'expiryDate', label: 'Payment Request Expiry Date', type: 'datetime'},
        {key: 'referenceId', label: 'Reference ID', type: 'string'},
        {key: 'allowCustomPaymentAmounts', label: 'Allow Custom Payment Amounts', type: 'boolean'},
    ],

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