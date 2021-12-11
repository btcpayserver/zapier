const Store = require('../common/Store');
const CryptoCode = require('../common/CryptoCode');
const Util = require('../common/Util');

const generateStoreLightningWalletAddress = async function (z, bundle) {
    const cryptoCode = bundle.inputData.crypto_code;
    const storeId = bundle.inputData.store_id;

    const options = {
        url: bundle.authData.server_url + '/api/v1/stores/' + encodeURI(storeId) + '/lightning/' + encodeURI(cryptoCode) + '/address',
        method: 'POST',
        params: {}
    };

    let response = await z.request(options);
    if (response.status === 200) {
        const address = response.json;
        return {address: address};

    } else if (response.status === 404) {
        throw new z.errors.Error('The lightning node configuration was not found.', 'NotFound', response.status);

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
        perform: generateStoreLightningWalletAddress,
        inputFields: [
            Store.inputFields.store_id,
            CryptoCode.inputFields.crypto_code,
        ],
        sample: {
            c: 'bc1qxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        },
        outputFields: [
            Util.outputFields.address
        ],
    },
    key: 'GenerateStoreLightningWalletAddress',
    noun: 'Lightning Wallet Address',
    display: {
        label: 'Generate Store\'s Lightning Wallet Address',
        description: 'Generates a new address for a store\'s lightning wallet.',
        hidden: false,
        important: false,
    },
};