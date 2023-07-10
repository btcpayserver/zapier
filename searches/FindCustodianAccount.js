const CustodianAccount = require('../common/CustodianAccount');
const Store = require('../common/Store');

const perform = async (z, bundle) => {
    const custodianAccount = await CustodianAccount.getById(z, bundle, bundle.inputData.store_id, bundle.inputData.custodian_account_id);
    if (custodianAccount) {
        return [custodianAccount];
    } else {
        return [];
    }
};

module.exports = {
    // see here for a full list of available properties:
    // https://github.com/zapier/zapier-platform/blob/master/packages/schema/docs/build/schema.md#searchschema
    key: 'FindCustodianAccount',
    noun: Store.noun,

    display: {
        label: 'Get Custodian Account Details',
        description: 'Finds a Custodian Account for a given ID and get the details.',
        hidden: false,
        important: false,
    },

    operation: {
        perform,
        inputFields: [
            Store.inputFields.store_id,
            CustodianAccount.inputFields.custodian_account_id
        ],
        sample: {
            "accountId": "xxxxxxxxxxxxxxx",
            "storeId": "yyyyyyyyyyyyyy",
            "custodianCode": "kraken",
            "name": "My Kraken Account",
            "assetBalances": [
                {
                    "asset": "BTC",
                    "qty": 1.23456
                },
                {
                    "asset": "USD",
                    "qty": 123456.78
                }
            ],
            "config": {
                "ApiKey": "xxx",
                "PrivateKey": "xxx"
            }
        },
        outputFields: CustodianAccount.outputFields

    }
};
