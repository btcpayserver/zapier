const Store = require('../../common/Store');
const CustodianAccount =  require('../../common/CustodianAccount');
const Util =  require('../../common/Util');

module.exports = {
    operation: {
        perform: async function (z, bundle) {
            const storeId = bundle.inputData.store_id;
            const custodianAccountId = bundle.inputData.custodian_account_id;
            const paymentMethod = bundle.inputData.payment_method;
            const qty = bundle.inputData.qty;

            return CustodianAccount.withdraw(z, bundle, storeId, custodianAccountId, paymentMethod, qty);
        },
        inputFields: [
            Store.inputFields.store_id,
            CustodianAccount.inputFields.custodian_account_id,
            Util.inputFields.payment_method,
            {
                key: 'qty',
                label: 'Quantity to withdraw',
                helpText: 'Quantity to withdraw. Can be a number or a percentage if the value ends with the "%" character.',
                type: 'string',
                required: true,
                list: false,
                altersDynamicFields: false,
            }
        ],
        sample: {
            "asset": "BTC",
            "paymentMethod": "BTC-OnChain",
            "ledgerEntries": [
                {
                    "asset": "BTC",
                    "qty": -0.123456,
                    "type": "Withdrawal"
                },
                {
                    "asset": "BTC",
                    "qty": -0.005,
                    "type": "Fee"
                }
            ],
            "withdrawalId": "XXXX-XXXX-XXXX-XXXX",
            "accountId": "xxxxxxxxxxxxxxx",
            "custodianCode": "kraken",
            "status": "Complete",
            "transactionId": "xxxxxxxxxxxxxxx",
            "targetAddress": "bc1qxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
        },
        outputFields: [
            {key: 'asset', label: 'Withdrawal Asset', type: 'string'},
            {key: 'paymentMethod', label: 'Withdrawal Payment Method', type: 'string'},
            {key: 'withdrawalId', label: 'Withdrawal ID', type: 'string'},
            {key: 'status', label: 'Withdrawal Status', type: 'string'},
            {key: 'transactionId', label: 'Withdrawal Transaction ID', type: 'string'},
            {key: 'targetAddress', label: 'Withdrawal Target Address', type: 'string'},
            {key: 'ledgerEntries[]asset', label: 'Ledger Entry Asset', type: 'string'},
            {key: 'ledgerEntries[]qty', label: 'Ledger Entry Quantity', type: 'number'},
            {key: 'ledgerEntries[]type', label: 'Ledger Entry Type (i.e. Withdrawal, Fee)', type: 'string'}
        ]
    },
    key: 'CustodianAccountWithdrawToStore',
    noun: 'Withdrawal',
    display: {
        label: 'Withdraw From a Custodian Account to Store Wallet (Experimental)',
        description: 'Withdraw Funds from a Custodian Account to your Store Wallet using a specific payment method like "BTC-OnChain".',
        hidden: false,
        important: false,
    },
};