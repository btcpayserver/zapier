const Store = require('../../common/Store');
const CustodianAccount =  require('../../common/CustodianAccount');
const Trade =  require('../../common/Trade');

const marketTrade = async function (z, bundle) {
    const serverUrl = bundle.authData.server_url;
    const storeId = bundle.inputData.store_id;
    const custodianAccountId = bundle.inputData.custodianAccountId;
    const qty = bundle.inputData.qty;
    const fromAsset = bundle.inputData.fromAsset;
    const toAsset = bundle.inputData.toAsset;

    return Trade.create(serverUrl, storeId, custodianAccountId, qty, fromAsset, toAsset);
}


module.exports = {
    operation: {
        perform: marketTrade,
        inputFields: [
            Store.inputFields.store_id,
            CustodianAccount.inputFields.custodian_account_id,
            Trade.inputFields.from_asset,
            Trade.inputFields.to_asset,
            Trade.inputFields.qty,
        ],
        sample: {
            fromAsset: 'BTC',
            toAsset: 'EUR',
            tradeId: '0000-0000-0000-0001',
            ledgerEntries: [
                {
                    "asset": "BTC",
                    "qty": 1.23456,
                    "type": "Trade"
                },
                {
                    "asset": "USD",
                    "qty": -61728,
                    "type": "Trade"
                },
                {
                    "asset": "BTC",
                    "qty": -0.00123456,
                    "type": "Fee"
                },
                {
                    "asset": "KFEE",
                    "qty": -123.456,
                    "type": "Fee"
                }
            ],
            accountId: 'xxxxxxxxxxxxxx',
            custodianCode: 'kraken'
        },
        outputFields: Trade.outputFields,
    },
    key: 'CustodianAccountMarketTrade',
    noun: 'Market Order',
    display: {
        label: 'Convert an Asset (Experimental)',
        description: 'Create a market order to convert one of your assets into another asset in your custodian account. Your custodian account must have trading support.',
        hidden: false,
        important: true,
    },
};