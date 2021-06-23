const Invoice = require('../common/Invoice');
const Store = require('../common/Store');

const createInvoice = async function (z, bundle) {
    // const options = {
    //     url: `${bundle.authData.server_url}/api/v1/stores/${bundle.inputData.store_id}/invoices/`,
    //     method: 'POST',
    //     params: {},
    //     body: {
    //         amount: bundle.inputData.amount,
    //         currency: bundle.inputData.currency_code,
    //         metadata: {
    //             orderId: bundle.inputData.order_id,
    //             buyerName: bundle.inputData.buyer_name,
    //             buyerEmail: bundle.inputData.buyer_email,
    //             buyerCountry: bundle.inputData.buyer_country,
    //             buyerZip: bundle.inputData.buyer_zip,
    //             buyerState: bundle.inputData.buyer_state,
    //             buyerCity: bundle.inputData.buyer_city,
    //             buyerAddress1: bundle.inputData.buyer_address1,
    //             buyerAddress2: bundle.inputData.buyer_address2,
    //             buyerPhone: bundle.inputData.buyer_phone,
    //         }
    //     }
    // };
    //
    // let response = await z.request(options);
    // if (response.status === 200) {
    //     return Invoice.format(response.json, bundle.inputData.store_id);
    // } else if (response.status === 403) {
    //     throw new z.errors.Error('Forbidden. Invoice could not be created.', 'Forbidden', response.status);
    // } else {
    //     let errorMsg = 'Error: ';
    //     for (let i = 0; i < response.json.length; i++) {
    //         errorMsg += response.json[i].message + ', ';
    //     }
    //     throw new z.errors.Error(errorMsg, 'InvalidData', response.status);
    // }

    return Invoice.create(
        z,
        bundle.authData.server_url,
        bundle.inputData.store_id,
        bundle.inputData.amount,
        bundle.inputData.currency_code,
        bundle.inputData.order_id,
        bundle.inputData.buyer_name,
        bundle.inputData.buyer_email,
        bundle.inputData.buyer_country,
        bundle.inputData.buyer_zip,
        bundle.inputData.buyer_state,
        bundle.inputData.buyer_city,
        bundle.inputData.buyer_address1,
        bundle.inputData.buyer_address2,
        bundle.inputData.buyer_phone
    );
}


module.exports = {
    operation: {
        perform: createInvoice,
        inputFields: [
            Store.inputFields.store_id,
            {
                key: 'amount',
                label: 'Amount To Pay',
                type: 'number',
                required: true,
                list: false,
                altersDynamicFields: false,
            },
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
            {
                key: 'buyer_zip',
                label: 'Buyer Zip',
                type: 'string',
                required: false,
                list: false,
                altersDynamicFields: false,
            },
            {
                key: 'buyer_state',
                label: 'Buyer State',
                type: 'string',
                required: false,
                list: false,
                altersDynamicFields: false,
            },
            {
                key: 'buyer_city',
                label: 'Buyer City',
                type: 'string',
                required: false,
                list: false,
                altersDynamicFields: false,
            },
            {
                key: 'buyer_address1',
                label: 'Buyer Address Line 1',
                type: 'string',
                required: false,
                list: false,
                altersDynamicFields: false,
            },
            {
                key: 'buyer_address2',
                label: 'Buyer Address Line 2',
                type: 'string',
                required: false,
                list: false,
                altersDynamicFields: false,
            },
            {
                key: 'buyer_phone',
                label: 'Buyer Phone',
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
            amount: '7.0',
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
    key: 'CreateInvoice',
    noun: Invoice.noun,
    display: {
        label: 'Create Invoice',
        description: 'Creates an Invoice',
        hidden: false,
        important: true,
    },
};
