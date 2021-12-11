const Store = require('../common/Store');
const CryptoCode = require('../common/CryptoCode');

const perform = async (z, bundle) => {
    const storeId = bundle.inputData.store_id;
    const cryptoCode = bundle.inputData.crypto_code;

    const options = {
        url: bundle.authData.server_url + '/api/v1/stores/' + encodeURI(storeId) + '/lightning/' + encodeURI(cryptoCode) + '/info',
        method: 'GET',
        params: {},
        body: {},
    };

    let response = await z.request(options);
    if (response.status === 200) {

        let torUri = null;
        let clearnetUri = null;

        let uris = response.json.nodeURIs;
        for (let i = 0; i < uris.length; i++) {
            let uri = uris[i];
            if (uri.indexOf('.onion:') < 0) {
                clearnetUri = uri;
            } else {
                torUri = uri;
            }
        }

        let r = {
            clearnetUri: clearnetUri,
            torUri: torUri
        };
        return r;

    } else if (response.status === 404) {
        throw new z.errors.Error('The lightning node configuration was not found.', 'NotFound', response.status);

    } else if (response.status === 503) {
        throw new z.errors.Error('Unable to access the lightning node.', 'ServiceUnavailable', response.status);

    } else {
        throw new z.errors.Error('Could not get the Store Lightning node URI.', 'BadRequest', response.status);
    }
};

module.exports = {
    key: 'GetStoreLightningNodeUri',
    noun: 'Lightning Node URI',

    display: {
        label: 'Get Store Lightning Node URI',
        description: 'Get the clearnet and tor URI of your store\'s lightning node.',
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
            "clearnetUri": "001bff4d106731791d900f30cee78d529a1b9e07559e7afc4076ec951619af674a@10.20.30.40:9735",
            "torUri": "001bff4d106731791d900f30cee78d529a1b9e07559e7afc4076ec951619af674a@786802c437a1bf766a78ad38b210c57092cb150072sm6nnsqm5lziyd.onion:9735"
        },
        outputFields: [
            {key: 'clearnetUri', label: 'Clearnet Node URI', type: 'string'},
            {key: 'torUri', label: 'Tor Node URI', type: 'string'},
        ],

    }
};
