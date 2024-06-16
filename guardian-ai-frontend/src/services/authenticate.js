//services/authenticate.js
import { AuthenticationDetails, CognitoUser } from 'amazon-cognito-identity-js';
import userpool from '../userpool';

export const authenticate = (Email, Password) => {
    return new Promise((resolve, reject) => {
        const user = new CognitoUser({
            Username: Email,
            Pool: userpool
        });

        const authDetails = new AuthenticationDetails({
            Username: Email,
            Password
        });

        user.authenticateUser(authDetails, {
            onSuccess: (result) => {

                const token = result.getIdToken().getJwtToken();
                const user_email = result.getIdToken().payload['email'];
                console.log('user_email', user_email)
                localStorage.setItem('user_email', user_email);
                localStorage.setItem('token', token);
                resolve({ status: 'success', result });
            },
            onFailure: (err) => {
                reject({ status: 'error', err });
            },
            newPasswordRequired: (userAttributes, requiredAttributes) => {
                // Exclude attributes that should not be modified
                delete userAttributes.email_verified;
                delete userAttributes.email;

                resolve({
                    status: 'newPasswordRequired',
                    cognitoUser: user, // Ensure this is correctly passed along
                    userAttributes,
                    requiredAttributes
                });
            },
        });
    });
};