import React, {createContext, useContext, useState, useEffect} from 'react';
import {CognitoUserPool} from 'amazon-cognito-identity-js';
import {poolData} from '../userpool'; // Ensure this path is correct for your setup

// Create a context for authentication data
const AuthContext = createContext({
    currentUser: null,
    getCurrentUserToken: async () => {
    },
    logout: () => {
    },
    isLoading: true,
    loginUser: () => {
    }
});

export function useAuth() {
    return useContext(AuthContext);
}

export const AuthProvider = ({children}) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const userPool = new CognitoUserPool(poolData);
        const cognitoUser = userPool.getCurrentUser();

        if (cognitoUser != null) {
            cognitoUser.getSession((err, session) => {
                setIsLoading(false);
                if (err) {
                    console.error('Error retrieving session:', err);
                    return;
                }
                if (session.isValid()) {
                    setCurrentUser(cognitoUser);
                }
            });
        } else {
            setIsLoading(false);
        }
    }, [isLoading]);

    const getCurrentUserToken = async () => {
        return new Promise((resolve, reject) => {
            const cognitoUser = new CognitoUserPool(poolData).getCurrentUser();
            if (cognitoUser) {
                cognitoUser.getSession((err, session) => {
                    if (err || !session.isValid()) {
                        reject(new Error("Failed to get valid session"));
                    } else {
                        resolve(session.getIdToken().getJwtToken());
                    }
                });
            } else {
                reject(new Error("No current user"));
            }
        });
    };

    const logout = () => {
        const cognitoUser = new CognitoUserPool(poolData).getCurrentUser();
        if (cognitoUser) {
            cognitoUser.signOut();
            setCurrentUser(null);
        }
    };

    const loginUser = (user) => {
        console.log('loginUser', user);
        setCurrentUser(user);
    };

    return (
        <AuthContext.Provider value={{currentUser, getCurrentUserToken, logout, isLoading, loginUser}}>
            {children}
        </AuthContext.Provider>
    );
};
