module.exports = {
    outputFields: [
        // {key: 'id', label: 'Invoice ID', type: 'string'},
    ],

    inputFields: {
        node_uri: {
            key: 'node_uri',
            label: 'Lightning Node URI',
            type: 'string',
            helpText: 'The Lightning Node\'s URI..',
            required: true,
            list: false,
            altersDynamicFields: false,
        }
    },
}