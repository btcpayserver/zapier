module.exports = {
    noun: 'Custodian Account',

    outputFields: [
        {key: 'id', label: 'Custodian Account ID', type: 'string'},
        {key: 'storeId', label: 'Store ID', type: 'string'},
        {key: 'name', label: 'Custodian Account Name', type: 'string'},
        {key: 'custodianCode', label: 'Custodian Code', type: 'string'},
        {key: 'assetBalances[]asset', label: 'Asset', type: 'string'},
        {key: 'assetBalances[]qty', label: 'Asset Quantity', type: 'number'}
    ],

    inputFields: {
        custodian_account_id: {
            key: 'custodian_account_id',
            label: 'Custodian Account ID',
            type: 'string',
            helpText: 'The custodian account ID.',
            required: true,
            altersDynamicFields: false,
            dynamic: 'custodian_account.id.name' // Meaning: resource "custodianAccount" with method "list". The value is in the "accountId" field and the label is in the "name" field.
        }
    },

    getById: async function (z, bundle, storeId, custodianAccountId) {
        const options = {
            url: bundle.authData.server_url + '/api/v1/stores/' + encodeURI(storeId) + '/custodian-accounts/' + encodeURI(custodianAccountId),
            method: 'GET',
            params: {
                assetBalances: true
            },
            body: {},
        };

        let response = await z.request(options);
        if (response.status === 200) {
            return this.format(response.json);
        } else {
            throw new z.errors.Error('Custodian account could not be found.', 'NotFound', 404);
        }
    },

    format: function (custodianAccount) {
        // invoice.amount = Number(invoice.amount);
        // invoice.monitoringExpiration = new Date(invoice.monitoringExpiration * 1000).toISOString();
        // invoice.expirationTime = new Date(invoice.expirationTime * 1000).toISOString();
        // invoice.createdTime = new Date(invoice.createdTime * 1000).toISOString();
        return custodianAccount;
    },

    formatWithdrawal: function (withdrawal) {
        return withdrawal;
    },

    getAll: function (z, bundle) {
        const storeId = bundle.inputData.store_id;
        const options = {
            url: bundle.authData.server_url + '/api/v1/stores/' + encodeURI(storeId) + '/custodian-accounts',
            method: 'GET',
            params: {},
            body: {},
        };

        return z.request(options).then((response) => {
            let results = response.json;

            for (let i = 0; i < results.length; i++) {
                results[i] = module.exports.format(results[i]);
            }
            return results;
        });
    },

    getAssetBalance: async function (z, bundle, storeId, custodianAccountId, asset) {
        const account = await this.getById(z, bundle, storeId, custodianAccountId);

        let qty = 0;
        if (account?.assetBalances) {
            let balance = account.assetBalances?.[asset];
            if (balance) {
                qty = balance;
            }
        }
        return {
            asset: asset,
            qty: qty
        };
    },


    getDepositAddress: async function (z, bundle, storeId, custodianAccountId, paymentMethod) {
        const options = {
            url: bundle.authData.server_url + '/api/v1/stores/' + encodeURI(storeId) + '/custodian-accounts/' + encodeURI(custodianAccountId) + '/addresses/' + encodeURI(paymentMethod),
            method: 'GET',
            params: {},
            body: {},
        };

        let response = await z.request(options);
        if (response.status === 200) {
            return response.json;
        } else {
            throw new z.errors.Error('Deposit address could not be loaded.', 'NotFound', 404);
        }
    },

    withdraw: async function (z, bundle, storeId, custodianAccountId, paymentMethod, qty) {
        const options = {
            url: bundle.authData.server_url + '/api/v1/stores/' + encodeURI(storeId) + '/custodian-accounts/' + encodeURI(custodianAccountId) + '/withdrawals',
            method: 'POST',
            params: {},
            body: {
                paymentMethod: paymentMethod,
                qty: qty
            },
        };

        let response = await z.request(options);
        if (response.status === 200) {
            return this.formatWithdrawal(response.json);
        } else {
            throw new z.errors.Error('An error occured when trying to withdraw funds.', 'NotFound', 404);
        }
    }
}