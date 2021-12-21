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
        "embeddedCSS": "body: { background: red; }",
        "customCSSLink": null,
        "allowCustomPaymentAmounts": false,
        "createdTime": "2021-12-21T11:08:36.833Z"
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
        {key: 'embeddedCSS', label: 'Embedded CSS code to be used on the payment page', type: 'string'},
        {key: 'customCSSLink', label: 'An URL to external CSS code to be used on the payment page', type: 'string'},
        {key: 'allowCustomPaymentAmounts', label: 'Allow Custom Payment Amounts', type: 'boolean'},
    ],

    format: function (data) {
        data.amount = Number(data.amount);

        if(typeof data.created === 'number') {
            // Current BTCPay Server version
            data.createdTime = new Date(data.created * 1000).toISOString();
        }else if(typeof data.created === 'string') {
            // Needed for compatibility with older versions from before https://github.com/btcpayserver/btcpayserver/pull/3221
            data.createdTime = new Date(data.created).toISOString();
        }

        // In previous versions, the created timestamp field was called "created"
        delete data['created'];

        return data;
    }
}