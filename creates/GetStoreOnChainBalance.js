const Store = require('../common/Store');
const CryptoCode = require('../common/CryptoCode');

const perform = async (z, bundle) => {
    const storeId = bundle.inputData.store_id;
    const cryptoCode = bundle.inputData.crypto_code;

    const options = {
        url: bundle.authData.server_url + '/api/v1/stores/' + encodeURI(storeId)+'/payment-methods/OnChain/'+encodeURI(cryptoCode)+'/wallet',
        method: 'GET',
        params: {},
        body: {},
    };

    let response = await z.request(options);
    if (response.status === 200) {
        let r = response.json;

        r.balance = Number(r.balance);
        r.unconfirmedBalance = Number(r.unconfirmedBalance);
        r.confirmedBalance = Number(r.confirmedBalance);

        return r;
    } else {
        throw new z.errors.Error('Store On-Chain wallet balance could not be found.', 'NotFound', 404);
    }
};

module.exports = {
    key: 'GetStoreOnChainBalance',
    noun: 'OnChain Wallet Balance',

    display: {
        label: 'Get Store On-Chain Wallet Balance',
        description: 'Get the balance of your On-Chain Store wallet.',
        hidden: false,
        important: false,
    },

    operation: {
        perform,
        inputFields: [
            Store.inputFields.store_id,
            CryptoCode.inputFields.crypto_code,
        ],
        sample: {
            "balance": 12.3456789,
            "unconfirmedBalance": 14.5678,
            "confirmedBalance": 12.3456789,
        },
        outputFields: [
            {key: 'balance', label: 'Balance', type: 'number'},
            {key: 'unconfirmedBalance', label: 'Unconfirmed Balance', type: 'number'},
            {key: 'confirmedBalance', label: 'Confirmed Balance', type: 'number'},
        ],

    }
};
