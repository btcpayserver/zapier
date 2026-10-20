module.exports = {
    noun: 'User',

    create: async function (z, serverUrl, email, name, is_administrator, send_invitation_email) {
        const options = {
            url: serverUrl + '/api/v1/users/',
            method: 'POST',
            params: {},
            body: {
                email: email,
                name: name,
                isAdministrator: is_administrator,
                // Without a password BTCPay Server invites the user to set one.
                sendInvitationEmail: String(send_invitation_email) !== 'false',
            }
        };

        let response = await z.request(options);
        if (response.status === 201) {
            return this.format(response.data);
        } else if (response.status === 403) {
            throw new z.errors.Error('Forbidden. User could not be created.', 'Forbidden', response.status);
        } else {
            let errorMsg = 'Error: ';
            for (let i = 0; i < response.data.length; i++) {
                errorMsg += response.data[i].message + ', ';
            }
            throw new z.errors.Error(errorMsg, 'InvalidData', response.status);
        }
    },

    format: function(user){
        user.created = new Date(user.created * 1000).toISOString();
        return user;
    },

    inputFields: {},
    //
    // getAll: function (z, bundle) {
    //     // Used for testing and setup. Just return the latest invoice in the same format as you'd normally get (see: perform() method).
    //     const options = {
    //         url: bundle.authData.server_url + '/api/v1/stores/',
    //         method: 'GET',
    //         params: {},
    //         body: {},
    //     };
    //
    //     return z.request(options).then((response) => {
    //         let results = response.data;
    //
    //         for (let i = 0; i < results.length; i++) {
    //             results[i] = module.exports.format(results[i]);
    //         }
    //         return results;
    //     });
    // },

    outputFields: [
        {key: 'id', label: 'User ID', type: 'string'},
        {key: 'email', label: 'Email', type: 'string'},
        {key: 'emailConfirmed', label: 'Email Confirmed', type: 'boolean'},
        {key: 'requiresEmailConfirmation', label: 'Requires Email Confirmation', type: 'boolean'},
        {key: 'created', label: 'Creation Date', type: 'datetime'},
        {key: 'roles[]', label: 'Roles', type: 'string'},
        {key: 'name', label: 'Name', type: 'string'},
        {key: 'approved', label: 'Approved', type: 'boolean'},
        {key: 'disabled', label: 'Disabled', type: 'boolean'},
        {key: 'invitationUrl', label: 'Invitation URL', type: 'string'},
    ],

}