const Util = require('../common/Util');
const Store = require('../common/Store');
const CryptoCode = require('../common/CryptoCode');

const createStoreOnChainWalletTransaction = async function (z, bundle) {
    const cryptoCode = bundle.inputData.crypto_code;
    const storeId = bundle.inputData.store_id;

    const destination = bundle.inputData.destination;
    const amount = bundle.inputData.amount;
    let subtractFeeFromAmount = bundle.inputData.subtract_fee_from_amount;
    let feeRate = bundle.inputData.fee_rate;

    if (feeRate <= 0) {
        feeRate = 1;
    }

    if (destination.startsWith('bitcoin:')) {
        // Must be false if destination is a BIP21 link
        subtractFeeFromAmount = false;
    }

    const options = {
        url: bundle.authData.server_url + '/api/v1/stores/' + encodeURI(storeId) + '/payment-methods/OnChain/' + encodeURI(cryptoCode) + '/wallet/transactions',
        method: 'POST',
        params: {},
        body: {
            destinations: [
                {
                    destination: destination,
                    amount: amount,
                    subtractFromAmount: subtractFeeFromAmount
                }
            ],
            feeRate: feeRate,
        }
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
        perform: createStoreOnChainWalletTransaction,
        inputFields: [
            Store.inputFields.store_id,
            {
                key: 'destination',
                label: 'Destination',
                type: 'string',
                helpText: 'The address where to send the money to or a BIP21 destination.',
                required: true,
                list: false,
                altersDynamicFields: false,
            },
            Util.inputFields.amount,
            CryptoCode.inputFields.crypto_code,
            Util.inputFields.fee_rate,
            {
                key: 'subtract_fee_from_amount',
                label: 'Subtract transaction fee from amount',
                type: 'boolean',
                helpText: 'Enable this if you want to empty your entire balance or you want the receiver to receive the amount minus the fees. If the destination is in the BIP21 format, you will always pay the transaction fee yourself.',
                required: true,
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
            {key: 'transactionHash', label: 'Transaction Hash', type: 'string'},
            {key: 'comment', label: 'Comment', type: 'string'},
            {key: 'amount', label: 'Amount', type: 'string'},
            {key: 'blockHash', label: 'Amount', type: 'string'},
            {key: 'blockHeight', label: 'Amount', type: 'integer'},
            {key: 'confirmations', label: 'Confirmations', type: 'integer'},
            {key: 'timestamp', label: 'Timestamp', type: 'integer'},
            {key: 'status', label: 'Status', type: 'string'},
            // {key: 'labels', label: 'Labels', type: 'array'}, // TODO not sure how to do "labels"
        ],
    },
    key: 'CreateStoreOnChainWalletTransaction',
    noun: 'On-Chain Transaction',
    display: {
        label: 'Create an On-Chain Transaction',
        description: 'Create an on-chain transaction from a store wallet to another address.',
        hidden: false,
        important: true,
    },
};