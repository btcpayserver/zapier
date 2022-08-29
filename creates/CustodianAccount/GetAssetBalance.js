const Store = require('../../common/Store');
const CustodianAccount =  require('../../common/CustodianAccount');
const Trade =  require('../../common/Trade');

const getAssetBalance = async function (z, bundle) {
    const storeId = bundle.inputData.storeId;
    const custodianAccountId = bundle.inputData.custodian_account_id;
    const asset = bundle.inputData.asset;
    const qty = bundle.inputData.qty;

    return CustodianAccount.getAssetBalance(z, bundle, storeId, custodianAccountId, asset);
}

module.exports = {
    operation: {
        perform: getAssetBalance,
        inputFields: [
            Store.inputFields.store_id,
            CustodianAccount.inputFields.custodian_account_id,
            Trade.inputFields.asset
        ],
        sample: {
            asset: 'BTC',
            qty: 1.23456
        },
        outputFields: [
            {key: 'asset', label: 'Asset', type: 'string'},
            {key: 'qty', label: 'Asset Quantity', type: 'number'},
        ]
    },
    key: 'GetCustodianAccountAssetBalance',
    noun: 'Asset Balance',
    display: {
        label: 'Get Asset Balance in Custodian Account (Experimental)',
        description: 'Get the balance of an asset held in a custodian account.',
        hidden: false,
        important: false,
    },
};