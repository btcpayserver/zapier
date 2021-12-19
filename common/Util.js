const crypto = require('crypto');

function HMAC256(data, secret) {
    const r = crypto.createHmac('sha256', secret)
        .update(data)
        .digest('hex');
    return r;
}

module.exports = {

    inputFields: {
        amount: {
            key: 'amount',
            label: 'Amount To Pay',
            type: 'number',
            required: true,
            list: false,
            altersDynamicFields: false,
        },
        currency_code: {
            key: 'currency_code',
            label: 'Currency Code',
            type: 'string',
            helpText:
                'The currency code the invoice is in. Can be in fiat (USD, EUR, etc) or in cryptocurrency (BTC, LTC, etc).',
            required: true,
            list: false,
            altersDynamicFields: false,
        },
        email: {
            key: 'email',
            label: 'Email',
            type: 'string',
            helpText: 'The customer\'s email address.',
            required: false,
            list: false,
            altersDynamicFields: false,
        },
        fee_rate: {
            key: 'fee_rate',
            label: 'Fee Rate',
            type: 'number',
            required: true,
            helpText: 'The fee for the transaction in sats/vbyte. Cannot be lower than 1.',
            list: false,
            altersDynamicFields: false,
        },
    },

    outputFields: {
        address: {key: 'address', label: 'Address', type: 'string'},
        paid: {key: 'paid', label: 'Is Paid', type: 'boolean'},
    },

    randomText: function (length) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() *
                charactersLength));
        }
        return result;
    },

    validateSignature: function (z, bundle) {
        const requestHash = bundle.rawRequest.headers['Http-Btcpay-Sig'];
        const ourHash = this.calculateHash(bundle);
        if (requestHash !== ourHash) {
            throw new z.errors.Error('Incoming webhook message is not signed correctly. Cannot trust the sender.', 'BadSignature', 403);
        }
    },

    calculateHash: function (bundle) {
        // TODO should we throw an exception if the secret is empty? That would be wierd.
        const correctSecret = bundle.subscribeData.secret;
        const r = 'sha256=' + HMAC256(bundle.rawRequest.content, correctSecret);
        return r;
    },

    performSubscribe: function (z, bundle, eventName) {
        // TODO is this unit tested?
        const options = {
            url: bundle.authData.server_url + '/api/v1/stores/' + encodeURI(bundle.inputData.store_id) + '/webhooks',
            method: 'POST',
            params: {},
            body: {
                url: bundle.targetUrl,
                enabled: true,
                automaticRedelivery: true,
                authorizedEvents: {
                    everything: false,
                    specificEvents: [eventName],
                }
            },
        };

        return z.request(options).then((response) => {
            const results = response.json;
            // This data will be saved in "bundle.subscribeData" so it can be used during unsubscribe.
            return results;
        });
    },

    performUnsubscribe: function (z, bundle) {
        // TODO is this unit tested?
        const hookId = bundle.subscribeData.id
        const options = {
            url: bundle.authData.server_url + '/api/v1/stores/' + bundle.authData.store_id + '/webhooks/' + encodeURI(hookId),
            method: 'DELETE',
            params: {},
            body: {},
        };

        return z.request(options).then((response) => {
            const results = response.json;
            return results;
        });
    }
}
