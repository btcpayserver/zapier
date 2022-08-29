const Store = require('../../common/Store');
const CustodianAccount =  require('../../common/CustodianAccount');
const Util =  require('../../common/Util');

const getDepositAddress = async function (z, bundle) {
    const storeId = bundle.inputData.store_id;
    const custodianAccountId = bundle.inputData.custodian_account_id;
    const paymentMethod = bundle.inputData.payment_method;

    return CustodianAccount.getDepositAddress(z, bundle, storeId, custodianAccountId, paymentMethod);
}


module.exports = {
    operation: {
        perform: getDepositAddress,
        inputFields: [
            Store.inputFields.store_id,
            CustodianAccount.inputFields.custodian_account_id,
            Util.inputFields.payment_method
        ],
        sample: {
            depositAddress: 'xxxxxxxxxxxxxxxxxxx',
        },
        outputFields: [
            {key: 'depositAddress', label: 'Deposit Address', type: 'string'}
        ]
    },
    key: 'GetCustodianAccountDepositAddress',
    noun: 'Deposit Address',
    display: {
        label: 'Get the Deposit Address for a Custodian Account (Experimental)',
        description: 'Get the Deposit Address to deposit funds in a Custodian Account using a specific payment method like "BTC-OnChain".',
        hidden: false,
        important: false,
    },
};