const Store = require('../common/Store');
const CryptoCode = require('../common/CryptoCode');
const Lightning = require('../common/Lightning');
const Util = require('../common/Util');

const perform = async (z, bundle) => {
    const storeId = bundle.inputData.store_id;
    const cryptoCode = bundle.inputData.crypto_code;

    const nodeUri = bundle.inputData.node_uri;
    const amount = bundle.inputData.amount;
    const feeRate = bundle.inputData.fee_rate;

    const options = {
        url: bundle.authData.server_url + '/api/v1/stores/' + encodeURI(storeId) + '/lightning/' + encodeURI(cryptoCode) + '/channels',
        method: 'POST',
        params: {},
        body: {
            nodeURI: nodeUri,
            channelAmount: amount,
            feeRate: feeRate
        },
    };

    let response = await z.request(options);
    if (response.status === 200) {
        return {opening: true};

    } else if (response.status === 400) {
        throw new z.errors.Error(response.json.message, response.json.code, response.status);

    } else if (response.status === 404) {
        throw new z.errors.Error('The lightning node configuration was not found.', 'NotFound', response.status);

    } else if (response.status === 422) {
        throw new z.errors.Error(response.json.message, 'UnableToValidate', response.status);

    } else if (response.status === 503) {
        throw new z.errors.Error('Unable to access the lightning node.', 'ServiceUnavailable', response.status);

    } else {
        throw new z.errors.Error('Could not get the Store Lightning node URI.', 'BadRequest', response.status);
    }
};

module.exports = {
    key: 'OpenStoreLightningChannel',
    noun: 'Lightning Node URI',

    display: {
        label: 'Open Store Lightning Channel',
        description: 'Open a Lightning Channel for the Store\'s Lightning Node.',
        hidden: false,
        important: false,
    },

    operation: {
        perform,
        inputFields: [
            Store.inputFields.store_id,
            CryptoCode.inputFields.crypto_code,
            Lightning.inputFields.node_uri,
            Util.inputFields.amount,
            Util.inputFields.fee_rate,
        ],
        sample: {
            opening: true
        },
        outputFields: [
            {key: 'opening', label: 'Channel is opening', type: 'boolean'},
        ],

    }
};
