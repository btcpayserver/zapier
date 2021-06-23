const crypto = require('crypto');

function HMAC256(data, secret) {
    const r = crypto.createHmac('sha256', secret)
        .update(data)
        .digest('hex');
    return r;
}

module.exports = {
    validateSignature: function (z, bundle) {
        const correctSecret = bundle.subscribeData.secret;
        const requestHash = bundle.rawRequest.headers['Http-Btcpay-Sig'];
        const ourHash = 'sha256=' + HMAC256(bundle.rawRequest.content, correctSecret);
        if (requestHash !== ourHash) {
            throw new z.errors.Error('Incoming webhook message is not signed correctly. Cannot trust the sender.', 'BadSignature', 403);
        }
    },

    performSubscribe: function (z, bundle, eventName) {
        const options = {
            url: `${bundle.authData.server_url}/api/v1/stores/${bundle.inputData.store_id}/webhooks`,
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

            // You can do any parsing you need for results here before returning them

            return results;
        });
    },

    performUnsubscribe: function (z, bundle) {
        const hookId = bundle.subscribeData.id
        console.log(bundle.subscribeData);

        const options = {
            url: `${bundle.authData.server_url}/api/v1/stores/${bundle.authData.store_id}/webhooks/` + hookId,
            method: 'DELETE',
            params: {},
            body: {},
        };

        return z.request(options).then((response) => {
            const results = response.json;

            // You can do any parsing you need for results here before returning them

            return results;
        });
    }
}
