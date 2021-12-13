const User = require('../common/User');

const createUser = async function (z, bundle) {
    return User.create(
        z,
        bundle.authData.server_url,
        bundle.inputData.email,
        bundle.inputData.password,
        bundle.inputData.is_administrator
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
                key: 'password',
                label: 'Password',
                type: 'string',
                required: true,
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
        ],
        sample: {
            "id": "abcdef",
            "email": "user@example.com",
            "emailConfirmed": true,
            "requiresEmailConfirmation": true,
            "created": "2021-07-08T12:17:24.000Z",
            "roles": [
                "admin"
            ]
        },
        outputFields: User.outputFields,
    },
    key: 'CreateUser',
    noun: User.noun,
    display: {
        label: 'Create User',
        description: 'Creates a User',
        hidden: false,
        important: false,
    },
};