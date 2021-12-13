const Invoice = require('../common/Invoice');
const Store = require('../common/Store');
const Util = require('../common/Util');
const PaymentRequest = require('../common/PaymentRequest');

const createPaymentRequest = async function (z, bundle) {
    const options = {
        url: serverUrl + '/api/v1/stores/' + encodeURI(storeId) + '/invoices/',
        method: 'POST',
        params: {},
        body: {
            amount: amount,
            currency: currency,
            metadata: {
                orderId: orderId,
                orderUrl: orderUrl,
                buyerName: buyerName,
                buyerEmail: buyerEmail,
                buyerCountry: buyerCountry,
                buyerZip: buyerZip,
                buyerState: buyerState,
                buyerCity: buyerCity,
                buyerAddress1: buyerAddress1,
                buyerAddress2: buyerAddress2,
                buyerPhone: buyerPhone,
            }
        }
    };

    let response = await z.request(options);
    if (response.status === 200) {
        return this.format(response.json);
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
                key: 'currency_code',
                label: 'Currency Code',
                type: 'string',
                helpText:
                    'The currency code the invoice is in. Can be in fiat (USD, EUR, etc) or in cryptocurrency (BTC, LTC, etc).',
                required: true,
                list: false,
                altersDynamicFields: false,
            },
            {
                key: 'order_id',
                label: 'Order ID',
                type: 'string',
                helpText: 'The Order ID you want to see in BTCPay Server',
                required: false,
                list: false,
                altersDynamicFields: false,
            },
            {
                key: 'order_url',
                label: 'Order URL',
                type: 'string',
                helpText: 'The URL where you can see the order in an external system.',
                required: false,
                list: false,
                altersDynamicFields: false,
            },
            {
                key: 'buyer_name',
                label: 'Buyer Name',
                type: 'string',
                required: false,
                list: false,
                altersDynamicFields: false,
            },
            {
                key: 'buyer_email',
                label: 'Buyer Email',
                type: 'string',
                required: false,
                list: false,
                altersDynamicFields: false,
            },
            {
                key: 'buyer_country',
                label: 'Buyer Country',
                type: 'string',
                required: false,
                list: false,
                altersDynamicFields: false,
            },
        ],
        sample: {
            id: 'VDdmfYJzJm9VtqW8hqhypF',
            checkoutLink: 'https://mybtcpayserver.com/i/VDdmfYJzJm9VtqW8hqhypF',
            status: 'New',
            additionalStatus: 'None',
            createdTime: "2021-07-08T12:17:24.000Z",
            expirationTime: "2021-07-08T12:32:24.000Z",
            monitoringExpiration: "2021-07-08T13:17:24.000Z",
            amount: 7.0,
            currency: 'EUR',
            metadata: {},
            checkout: {
                speedPolicy: 'MediumSpeed',
                paymentMethods: ['BTC', 'BTC-LightningNetwork'],
                expirationMinutes: 15,
                monitoringMinutes: 60,
                paymentTolerance: 0,
                redirectURL: null,
                redirectAutomatically: false,
                defaultLanguage: null,
            },
        },
        outputFields: Invoice.outputFields,
    },
    key: 'CreatePaymentRequest',
    noun: PaymentRequest.noun,
    display: {
        label: 'Create Payment Request',
        description: 'Creates an Payment Request',
        hidden: false,
        important: true,
    },
};