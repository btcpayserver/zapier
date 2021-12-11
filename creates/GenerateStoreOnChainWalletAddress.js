const Store = require('../common/Store');
const CryptoCode = require('../common/CryptoCode');
const Util = require('../common/Util');

const generateStoreOnChainWalletAddress = async function (z, bundle) {
    const cryptoCode = bundle.inputData.crypto_code;
    const storeId = bundle.inputData.store_id;
    let forceGenerate = bundle.inputData.force_generate;

    const options = {
        url: bundle.authData.server_url + '/api/v1/stores/' + encodeURI(storeId) + '/payment-methods/OnChain/' + encodeURI(cryptoCode) + '/wallet/address?forceGenerate=' + encodeURI(forceGenerate),
        method: 'GET',
        params: {}
    };

    let response = await z.request(options);
    if (response.status === 200) {
        return response.json;
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
        perform: generateStoreOnChainWalletAddress,
        inputFields: [
            Store.inputFields.store_id,
            CryptoCode.inputFields.crypto_code,
            {
                key: 'force_generate',
                label: 'Force Generate a New Address',
                type: 'boolean',
                helpText: 'If true, this will force a new address. Otherwise you can get an address that\'s been given before but was unused. Defaults to "false".',
                required: false,
                list: false,
                altersDynamicFields: false,
            }
        ],
        sample: {
            address: 'bc1qxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
            keyPath: '0/100',
            paymentLink: 'bitcoin:bc1qxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        },
        outputFields: [
            Util.outputFields.address,
            {key: 'keyPath', label: 'Key Path', type: 'string'},
            {key: 'paymentLink', label: 'Payment Link', type: 'string'},
        ],
    },
    key: 'GenerateStoreOnChainWalletAddress',
    noun: 'On-Chain Wallet Address',
    display: {
        label: 'Generate On-Chain Wallet Address',
        description: 'Generates a new address for a store wallet.',
        hidden: false,
        important: false,
    },
};