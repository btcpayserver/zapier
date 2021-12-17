const authentication = require('./authentication');
const invoiceCreated = require('./triggers/InvoiceCreated.js');
const invoiceExpired = require('./triggers/InvoiceExpired.js');
const invoiceInvalid = require('./triggers/InvoiceInvalid.js');
const invoiceProcessing = require('./triggers/InvoiceProcessing.js');
const invoiceSettled = require('./triggers/InvoiceSettled.js');
const invoicePaymentSettled = require('./triggers/InvoicePaymentSettled.js');
const paymentReceived = require('./triggers/InvoiceReceivedPayment.js');

const createInvoice = require("./creates/CreateInvoice");
const createUser = require("./creates/CreateUser");
const markInvoiceInvalid = require("./creates/MarkInvoiceInvalid");
const markInvoiceSettled = require("./creates/MarkInvoiceSettled");
const generateStoreOnChainWalletAddress = require("./creates/GenerateStoreOnChainWalletAddress");
const generateStoreLightningWalletAddress = require("./creates/GenerateStoreLightningWalletAddress");
const createStoreOnChainWalletTransaction = require("./creates/CreateStoreOnChainWalletTransaction");
const getStoreOnChainBalance = require("./creates/GetStoreOnChainBalance");
const getStoreLightningNodeUri = require("./creates/GetStoreLightningNodeUri");
const openStoreLightningChannel = require("./creates/OpenStoreLightningChannel");
const payLightningInvoice = require("./creates/PayLightningInvoice");
const createPaymentRequest = require("./creates/CreatePaymentRequest");

const findInvoice = require("./searches/FindInvoice");
const findStore = require("./searches/FindStore");





// TODO add deliveryId to all triggers
// TODO add webhookId to all triggers
// TODO add originalDeliveryId to all triggers
// TODO add isRedelivery to all triggers




const beforeRequest = (request, z, bundle) => {
    request.headers['Content-Type'] = 'application/json';
    request.headers['Accept'] = 'application/json';
    request.headers['Authorization'] = 'token ' + bundle.authData.api_key;
    request.headers['X-Client'] = 'Zapier ' + require('./package.json').version;

    // Avoid double // in the URL if the user entered the server_url with a trailing slash.
    if (bundle.authData.server_url.endsWith('/')) {
        request.url = request.url.replace(bundle.authData.server_url + '/', bundle.authData.server_url);
    }

    return request;
};

const afterResponse = (response, z) => {

    // TODO refactor error handling for all calls! Start using "HaltedError" and "ExpiredAuthError" instead of always using "Error", which turns off the zap entirely!!
    // Error - Stops the current operation, allowing for (auto) replay. Read more on General Errors
    // HaltedError - Stops current operation, but will never turn off Zap. Read more on Halting Execution
    // ExpiredAuthError - Turns off Zap and emails user to manually reconnect. Read more on Stale Authentication Credentials

    if (response.status === 403 && 'missing-permission' === response.json.code) {
        throw new z.errors.ExpiredAuthError(response.json.message);
    }
    return response;
};

module.exports = {
    version: require('./package.json').version,
    platformVersion: require('zapier-platform-core').version,
    authentication: authentication,
    beforeRequest: [beforeRequest],
    afterResponse: [afterResponse],

    resources: {
        store: {
            key: 'store',
            noun: 'Store',
            // ...
            list: {
                display: {
                    label: 'Stores',
                    description: 'A list of all stores',
                    hidden: true,
                },
                operation: {
                    perform: (z, bundle) => {
                        // This is called to populate tthe store_id dropdown
                        const Stores = require('./common/Store.js');
                        return Stores.getAll(z, bundle);
                    },
                },
            },
        },
    },

    triggers: {
        [invoiceCreated.key]: invoiceCreated,
        [paymentReceived.key]: paymentReceived,
        [invoiceProcessing.key]: invoiceProcessing,
        [invoiceSettled.key]: invoiceSettled,
        [invoicePaymentSettled.key]: invoicePaymentSettled,
        [invoiceExpired.key]: invoiceExpired,
        [invoiceInvalid.key]: invoiceInvalid,
    },

    creates: {
        [createInvoice.key]: createInvoice,
        [createUser.key]: createUser,
        [markInvoiceInvalid.key]: markInvoiceInvalid,
        [markInvoiceSettled.key]: markInvoiceSettled,
        [generateStoreOnChainWalletAddress.key]: generateStoreOnChainWalletAddress,
        [generateStoreLightningWalletAddress.key]: generateStoreLightningWalletAddress,
        [createStoreOnChainWalletTransaction.key]: createStoreOnChainWalletTransaction,
        [getStoreOnChainBalance.key]: getStoreOnChainBalance,
        [getStoreLightningNodeUri.key]: getStoreLightningNodeUri,
        [openStoreLightningChannel.key]: openStoreLightningChannel,
        [payLightningInvoice.key]: payLightningInvoice,
        [createPaymentRequest.key]: createPaymentRequest,
    },

    searches: {
        [findInvoice.key]: findInvoice,
        [findStore.key]: findStore
    }
};