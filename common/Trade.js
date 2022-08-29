module.exports = {
    noun: 'Trade',

    create: async function (z, serverUrl, storeId, custodianAccountId, qty, fromAsset, toAsset) {
        let isPercentage = (""+qty).endsWith("%");
        let qtyNumber = qty;
        if(isPercentage){
            qtyNumber = qty.slice(0, -1);
        }
        if(isNaN(qtyNumber)){
            throw new z.errors.Error('Quantity is not a number or a percentage ending with "%"', 'InvalidQty', qty);
        }else {
            const options = {
                url: serverUrl + '/api/v1/stores/' + encodeURI(storeId) + '/custodian-accounts/' + encodeURI(custodianAccountId) + '/trades/market',
                method: 'POST',
                params: {},
                body: {
                    fromAsset: fromAsset,
                    toAsset: toAsset,
                    qty: qty,
                }
            };

            let response = await z.request(options);

            if (response.status === 200) {
                return this.format(response.json);
            } else if (response.status === 403) {
                throw new z.errors.Error('Forbidden. Order could not be created.', 'Forbidden', response.status);
            } else {
                let errorMsg = 'Error: ';
                for (let i = 0; i < response.json.length; i++) {
                    errorMsg += response.json[i].message + ', ';
                }
                throw new z.errors.Error(errorMsg, 'InvalidData', response.status);
            }
        }
    },

    format: function (trade) {
        // trade.amount = Number(trade.amount);
        // trade.createdTime = new Date(trade.createdTime * 1000).toISOString();
        return trade;
    },

    inputFields: {
        asset: {
            key: 'asset',
            label: 'Asset',
            type: 'string',
            helpText: 'The currency code. Can be fiat (USD, EUR, etc) or cryptocurrency (BTC, LTC, etc).',
            required: true,
            list: false,
            altersDynamicFields: false,
        },
        from_asset: {
            key: 'from_asset',
            label: 'From Asset',
            type: 'string',
            helpText: 'The currency code you want to convert. Can be fiat (USD, EUR, etc) or cryptocurrency (BTC, LTC, etc).',
            required: true,
            list: false,
            altersDynamicFields: false,
        },
        to_asset: {
            key: 'to_asset',
            label: 'To Asset',
            type: 'string',
            helpText: 'The currency code you want to buy. Can be fiat (USD, EUR, etc) or cryptocurrency (BTC, LTC, etc).',
            required: true,
            list: false,
            altersDynamicFields: false,
        },
        qty: {
            key: 'qty',
            label: 'Quantity to trade',
            helpText: 'Quantity of the "From Asset" to convert into the "To Asset". Can be a number or a percentage if the value ends with the "%" character.',
            type: 'string',
            required: true,
            list: false,
            altersDynamicFields: false,
        },
    },

    outputFields: [
        {key: 'tradeId', label: 'Trade ID', type: 'string'},
        {key: 'fromAsset', label: 'From Asset', type: 'string'},
        {key: 'toAsset', label: 'To Asset', type: 'string'},
        {key: 'accountId', label: 'Custodian Account ID', type: 'string'},
        {key: 'custodianCode', label: 'Custodian Code', type: 'string'},
        {key: 'ledgerEntries[]asset', label: 'Ledger Entry Asset', type: 'string'},
        {key: 'ledgerEntries[]qty', label: 'Ledger Entry Quantity', type: 'number'},
        {key: 'ledgerEntries[]type', label: 'Ledger Entry Type (i.e. Trade, Withdrawal, Deposit, Fee)', type: 'string'}
    ],

}