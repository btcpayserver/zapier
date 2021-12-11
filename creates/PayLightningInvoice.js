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
    if (response.status === 200) {
        return {paid: true};

        // TODO refactor so these error statusses are less copy-paste
    } else if (response.status === 400) {
        throw new z.errors.Error(response.json.message, response.json.code, response.status);

    } else if (response.status === 404) {
        throw new z.errors.Error('The lightning node configuration was not found.', 'NotFound', response.status);

    } else if (response.status === 422) {
        throw new z.errors.Error(response.json.message, 'UnableToValidate', response.status);

    } else if (response.status === 503) {
        throw new z.errors.Error('Unable to access the lightning node.', 'ServiceUnavailable', response.status);

    } else {
        let errorMsg = 'Error';
        // for (let i = 0; i < response.json.length; i++) {
        //     errorMsg += response.json[i].message + ', ';
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
        },
        outputFields: [
            Util.outputFields.paid
        ],
    },
    key: 'PayLightningInvoice',
    noun: 'Lightning Payment',
    display: {
        label: 'Pay a Lightning Invoice',
        description: 'Pay a Lightning Invoice using your Store\'s Lightning Wallet.',
        hidden: false,
        important: false,
    },
};