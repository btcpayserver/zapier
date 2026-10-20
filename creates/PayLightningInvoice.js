const Store = require('../common/Store');
const CryptoCode = require('../common/CryptoCode');
const Util = require('../common/Util');
const Lightning = require('../common/Lightning');

const payLightningInvoice = async function (z, bundle) {
    const cryptoCode = bundle.inputData.crypto_code;
    const storeId = bundle.inputData.store_id;
    const bolt11 = bundle.inputData.bolt11;

    const options = {
        url: bundle.authData.server_url + '/api/v1/stores/' + encodeURI(storeId) + '/lightning/' + encodeURI(cryptoCode) + '/invoices/pay',
        method: 'POST',
        params: {},
        body:{
            BOLT11: bolt11
        }
    };

    let response = await z.request(options);
    if (response.status === 200 || response.status === 202) {
        // 202 means the payment was started, but is not complete yet.
        const payment = response.data || {};
        return {
            paid: response.status === 200,
            status: payment.status,
            paymentHash: payment.paymentHash,
            preimage: payment.preimage,
            totalAmount: payment.totalAmount,
            feeAmount: payment.feeAmount,
        };

        // TODO refactor so these error statusses are less copy-paste
    } else if (response.status === 400) {
        throw new z.errors.Error(response.data.message, response.data.code, response.status);

    } else if (response.status === 404) {
        throw new z.errors.Error('The lightning node configuration was not found.', 'NotFound', response.status);

    } else if (response.status === 422) {
        throw new z.errors.Error(response.data.message, 'UnableToValidate', response.status);

    } else if (response.status === 503) {
        throw new z.errors.Error('Unable to access the lightning node.', 'ServiceUnavailable', response.status);

    } else {
        let errorMsg = 'Error';
        // for (let i = 0; i < response.data.length; i++) {
        //     errorMsg += response.data[i].message + ', ';
        // }
        throw new z.errors.Error(errorMsg, 'InvalidData', response.status);
    }
}


module.exports = {
    operation: {
        perform: payLightningInvoice,
        inputFields: [
            Store.inputFields.store_id,
            CryptoCode.inputFields.crypto_code,
            Lightning.inputFields.bolt11,
        ],
        sample: {
            paid: true,
            status: 'Complete',
            paymentHash: '6f76506a9dd8b4463eeebbd45f251a6f8560c2be5735084fd38a5c050906eb07',
            preimage: '3a1b5c8e0f2d4a6b7c9e1f3a5b7d9e0f2a4c6e8b0d1f3a5c7e9b1d3f5a7c9e1b',
            totalAmount: '13787000',
            feeAmount: '0',
        },
        outputFields: [
            Util.outputFields.paid,
            {key: 'status', label: 'Payment Status', type: 'string'},
            {key: 'paymentHash', label: 'Payment Hash', type: 'string'},
            {key: 'preimage', label: 'Preimage', type: 'string'},
            {key: 'totalAmount', label: 'Total Amount Including Fees (millisatoshi)', type: 'string'},
            {key: 'feeAmount', label: 'Fee Amount (millisatoshi)', type: 'string'},
        ],
    },
    key: 'PayLightningInvoice',
    noun: 'Lightning Payment',
    display: {
        label: 'Pay a Lightning Invoice',
        description: 'Pay a Lightning Invoice using your Store\'s Lightning Wallet.',
        hidden: false,
    },
};