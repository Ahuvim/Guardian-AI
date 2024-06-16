//src/userpool.js
import {CognitoUserPool} from 'amazon-cognito-identity-js';

export const poolData= {
    UserPoolId: 'eu-west-1_fVH9NPIgG', // This matches your .env file
    ClientId: '3b4i5ehlntflh6o62bd47tic1t' // Adjusted to match the .env variable name
};
export default new CognitoUserPool(poolData);