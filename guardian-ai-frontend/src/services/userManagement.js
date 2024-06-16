//services/userManagement.js
import { CognitoUser } from "amazon-cognito-identity-js";
import userPool from "../userpool";

export const submitNewPassword = (cognitoUser, newPassword, userAttributes) => {
    return new Promise((resolve, reject) => {
        // Directly use the cognitoUser parameter, which now includes session information
        cognitoUser.completeNewPasswordChallenge(newPassword, userAttributes, {
            onSuccess: (result) => {

                resolve(result);
            },
            onFailure: (err) => {

                reject(err);
            },
        });
    });
};

export const initiateResetPassword = (Email) => {
    return new Promise((resolve, reject) => {
        const cognitoUser = new CognitoUser({
            Username: Email,
            Pool: userPool,
        });

        cognitoUser.forgotPassword({
            onSuccess: (data) => {

                resolve(data);
            },
            onFailure: (err) => {

                reject(err);
            },
            // Optional: if MFA is enabled
            inputVerificationCode: (data) => {

                resolve(data);
            }
        });
    });
};