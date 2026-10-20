const Invoice = require('./Invoice');

module.exports = {
    noun: 'Invoice',

    // The payment that BTCPay Server sends along with the "InvoiceReceivedPayment" and "InvoicePaymentSettled" webhooks.
    outputFields: [
        {key: 'trigger__receivedAfterExpiration', label: 'Payment received after expiration', type: 'boolean'},
        {key: 'trigger__paymentMethodId', label: 'Payment Method', type: 'string'},
        {key: 'trigger__payment__id', label: 'Payment ID', type: 'string'},
        {key: 'trigger__payment__receivedDate', label: 'Payment Received At', type: 'datetime'},
        {key: 'trigger__payment__value', label: 'Payment Amount', type: 'number'},
        {key: 'trigger__payment__fee', label: 'Payment Fee', type: 'number'},
        {key: 'trigger__payment__status', label: 'Payment Status', type: 'string'},
        {key: 'trigger__payment__destination', label: 'Payment Destination', type: 'string'},
    ],

    sample: {
        receivedAfterExpiration: false,
        paymentMethodId: 'BTC-CHAIN',
        payment: {
            id: '523d18e95b173bf5818a64615b548cf577529b2b9f1db2a4bc5bfeadffb2b007-0',
            receivedDate: '2021-07-08T12:20:24.000Z',
            value: 0.00013787,
            fee: 0,
            status: 'Processing',
            destination: 'bc1qxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
        }
    },

    formatTrigger: function (webhook) {
        const payment = webhook.payment || {};
        return {
            receivedAfterExpiration: webhook.afterExpiration,
            // BTCPay Server 1.x called this field "paymentMethod".
            paymentMethodId: webhook.paymentMethodId || webhook.paymentMethod,
            payment: {
                id: payment.id,
                receivedDate: payment.receivedDate ? new Date(payment.receivedDate * 1000).toISOString() : null,
                value: Number(payment.value),
                fee: Number(payment.fee),
                status: payment.status,
                destination: payment.destination
            }
        };
    },

    performForInvoicePayment: async function (z, bundle) {
        const results = await Invoice.performForOne(z, bundle);
        results[0].trigger = module.exports.formatTrigger(bundle.cleanedRequest);
        return results;
    },
}
