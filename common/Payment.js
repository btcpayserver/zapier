module.exports = {
    noun: 'Invoice',


    outputFields: [
        {key: 'paymentMethod', label: 'Payment Method', type: 'string'}, // TODO check this
        {key: 'cryptoCode', label: 'Cryptocurrency Code', type: 'string'}, // TODO check this
        {key: 'destination', label: 'Destination', type: 'string'}, // TODO check this
        {key: 'paymentLink', label: 'Payment Link', type: 'string'}, // TODO check this
        {key: 'rate', label: 'Fee Rate', type: 'string'}, // TODO check this
        {key: 'paymentMethodPaid', label: 'Payment Method Paid', type: 'string'}, // TODO check this
        {key: 'totalPaid', label: 'Total Paid', type: 'string'}, // TODO check this
        {key: 'due', label: 'Due', type: 'string'}, // TODO check this
        {key: 'amount', label: 'Amount Paid', type: 'string'}, // TODO check this
        {key: 'networkFee', label: 'Network Fee', type: 'string'}, // TODO check this

        // {key: 'metadata__orderId', label: 'Order ID', type: 'string'},
        // {key: 'metadata__posData', label: 'POS Data', type: 'string'},
        // {key: 'metadata__itemDesc', label: 'Item Description', type: 'string'},
        // {key: 'metadata__buyerEmail', label: 'Buyer Email', type: 'string'},
        // {key: 'metadata__buyerName', label: 'Buyer Name', type: 'string'},
        // {key: 'metadata__physical', label: 'Is Physical', type: 'boolean'},
        // {key: 'metadata__taxIncluded', label: 'Tax Amount Included', type: 'boolean'}, // TODO This field is not in the Greenfield API docs. Should we remove it using format() ?
        // {key: 'checkout__speedPolicy', label: 'Speed Policy', type: 'string'},
        // {key: 'checkout__paymentMethods[]', label: 'Payment Method', type: 'string'},
        // {key: 'checkout__expirationMinutes', label: 'Expiration Minutes', type: 'string'},
        // {key: 'checkout__monitoringMinutes', label: 'Monitoring Minutes', type: 'string'},
        // {key: 'checkout__paymentTolerance', label: 'Payment Tolerance', type: 'number'},
        // {key: 'checkout__redirectURL', label: 'Redirect URL', type: 'string'},
        // {key: 'checkout__redirectAutomatically', label: 'Redirect Automatically', type: 'boolean'},
        // {key: 'checkout__defaultLanguage', label: 'Default Language', type: 'string'}, // TODO This field may be abandoned once we have auto language detection? Should we remove it using format() ?
        // {key: 'checkoutLink', label: 'Payment URL', type: 'string'},
        // {key: 'status', label: 'Status', type: 'string'},
        // {key: 'additionalStatus', label: 'Additional Status', type: 'string'},
        // {key: 'createdTime', label: 'Invoice Created At', type: 'datetime'},
        // {key: 'amount', label: 'Amount', type: 'number'},
        // {key: 'currency', label: 'Currency', type: 'string'},
        // {key: 'expirationTime', label: 'Invoice Expiration', type: 'datetime'},
        // {key: 'monitoringExpiration', label: 'Monitoring Expiration', type: 'datetime'},
    ],
    sample: {
        "paymentMethod": "string",
        "cryptoCode": "BTC",
        "destination": "string",
        "paymentLink": "string",
        "rate": "string",
        "paymentMethodPaid": "string",
        "totalPaid": "string",
        "due": "string",
        "amount": "string",
        "networkFee": "string",
        "payments": [
            {
                "id": "string",
                "receivedDate": 1592312018,
                "value": "string",
                "fee": "string",
                "status": "Invalid",
                "destination": "string"
            }
        ],
        "activated": true
    },

}