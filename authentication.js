module.exports = {
    type: 'custom',
    connectionLabel: '{{server_url}}',
    test: {
        url: '{{bundle.authData.server_url}}/api/v1/server/info',
        method: 'GET',
        params: {
        },
        headers: {
            Authorization: 'token {{bundle.authData.api_key}}'
        },
        body: {},
        removeMissingValuesFrom: {},
        // TODO validate the API key. Does it have all the Store ID permissions? Nothing more? Nothing less?
    },
    fields: [
        {
            computed: false,
            key: 'server_url',
            required: true,
            label: 'BTCPay Server URL',
            type: 'string',
            helpText: 'Enter your BTC Pay Server URL.',
            default: 'https://mybtcpay.com',
        },
        {
            computed: false,
            key: 'api_key',
            required: true,
            label: 'API Key',
            type: 'string',
            helpText: 'You can create an API key by going to My Account > API Keys in BTCPay Server.',
        }
    ],
    customConfig: {},
};
