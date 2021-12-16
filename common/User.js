module.exports = {
    noun: 'User',

    create: async function (z, serverUrl, email, password, is_administrator) {
        const options = {
            url: serverUrl + '/api/v1/users/',
            method: 'POST',
            params: {},
            body: {
                email: email,
                password: password,
                isAdministrator: is_administrator,
            }
        };

        let response = await z.request(options);
        if (response.status === 201) {
            return this.format(response.json);
        } else if (response.status === 403) {
            throw new z.errors.Error('Forbidden. Invoice could not be created.', 'Forbidden', response.status);
        } else {
            let errorMsg = 'Error: ';
            for (let i = 0; i < response.json.length; i++) {
                errorMsg += response.json[i].message + ', ';
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
    //         let results = response.json;
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
    ],

}