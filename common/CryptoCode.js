module.exports = {
    noun: 'Crypto Code',

    outputFields: [
        // {key: 'id', label: 'Invoice ID', type: 'string'},
    ],

    inputFields: {
        crypto_code: {
            key: 'crypto_code',
            label: 'Crypto Code',
            type: 'string',
            helpText: 'The cryptocurrency to be used like "BTC".',
            required: true,
            list: false, // TODO is there a way to get a list of all crypto codes?
            altersDynamicFields: false,
        }
    },
}