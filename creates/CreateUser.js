const User = require('../common/User');

const createUser = async function (z, bundle) {
    return User.create(
        z,
        bundle.authData.server_url,
        bundle.inputData.email,
        bundle.inputData.name,
        bundle.inputData.is_administrator,
        bundle.inputData.send_invitation_email
    );
}


module.exports = {
    operation: {
        perform: createUser,
        inputFields: [
            {
                key: 'email',
                label: 'Email',
                type: 'string',
                required: true,
                list: false,
                altersDynamicFields: false,
            },
            {
                key: 'name',
                label: 'Name',
                type: 'string',
                required: false,
                list: false,
                altersDynamicFields: false,
            },
            {
                key: 'is_administrator',
                label: 'Make Administrator',
                type: 'boolean',
                helpText: 'Make this user an administrator, only possible if your API key has the "unrestricted" permission.',
                required: false,
                list: false,
                altersDynamicFields: false,
            },
            {
                key: 'send_invitation_email',
                label: 'Send Invitation Email',
                type: 'boolean',
                helpText: 'Send the user an email to set a password. Needs email settings in BTCPay Server. Either way, the "Invitation URL" lets the user set a password. Defaults to "true".',
                required: false,
                list: false,
                altersDynamicFields: false,
            },
        ],
        sample: {
            "id": "abcdef",
            "email": "user@example.com",
            "name": "Satoshi Nakamoto",
            "emailConfirmed": true,
            "requiresEmailConfirmation": true,
            "created": "2021-07-08T12:17:24.000Z",
            "roles": [
                "ServerAdmin"
            ],
            "approved": true,
            "disabled": false,
            "invitationUrl": "https://mybtcpayserver.com/invite/abcdef/fd4c3a9aa8ff"
        },
        outputFields: User.outputFields,
    },
    key: 'CreateUser',
    noun: User.noun,
    display: {
        label: 'Create User',
        description: 'Creates a User',
        hidden: false,
    },
};