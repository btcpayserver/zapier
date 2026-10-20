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

    // A channel can only be opened to a connected peer. Connecting again to a connected peer is fine.
    await z.request({
        url: bundle.authData.server_url + '/api/v1/stores/' + encodeURI(storeId) + '/lightning/' + encodeURI(cryptoCode) + '/connect',
        method: 'POST',
        params: {},
        body: {
            nodeURI: nodeUri
        },
    });

    const options = {
        url: bundle.authData.server_url + '/api/v1/stores/' + encodeURI(storeId) + '/lightning/' + encodeURI(cryptoCode) + '/channels',
        method: 'POST',
        params: {},
        body: {
            nodeURI: nodeUri,
            // BTCPay Server wants a whole number of satoshi.
            channelAmount: Math.round(Number(amount)),
            feeRate: feeRate
        },
    };

    let response = await z.request(options);
    if (response.status === 200) {
        return {opening: true};

    } else if (response.status === 400) {
        throw new z.errors.Error(response.data.message, response.data.code, response.status);

    } else if (response.status === 404) {
        throw new z.errors.Error('The lightning node configuration was not found.', 'NotFound', response.status);

    } else if (response.status === 422) {
        throw new z.errors.Error(response.data.message, 'UnableToValidate', response.status);

    } else if (response.status === 503) {
        throw new z.errors.Error('Unable to access the lightning node.', 'ServiceUnavailable', response.status);

    } else {
        throw new z.errors.Error('Could not open the Lightning channel.', 'BadRequest', response.status);
    }
};

module.exports = {
    key: 'OpenStoreLightningChannel',
    noun: 'Lightning Channel',

    display: {
        label: 'Open Store Lightning Channel',
        description: 'Open a Lightning Channel for the Store\'s Lightning Node.',
        hidden: false,
    },

    operation: {
        perform,
        inputFields: [
            Store.inputFields.store_id,
            CryptoCode.inputFields.crypto_code,
            Lightning.inputFields.node_uri,
            {
                key: 'amount',
                label: 'Channel Amount (satoshi)',
                type: 'integer',
                helpText: 'The amount in satoshi to fund the channel with. 100000 satoshi is 0.001 BTC.',
                required: true,
                list: false,
                altersDynamicFields: false,
            },
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
