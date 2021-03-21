import React, {useState, useContext, createContext, useEffect} from 'react'
import { useApolloClient } from '@apollo/client'
import { useRouter } from 'next/router'

import { useSignInMutation } from '../lib/graphql/signin.graphql'
import { useSignUpMutation } from '../lib/graphql/signup.graphql'
import { useCurrentUserQuery } from '../lib/graphql/currentUser.graphql'
import { useSignOutMutation } from '../lib/graphql/signout.graphql'

type AuthProps = {
    user: any;
    error: string;
    signIn: (email: any, password: any) => Promise<void>;
    signUp: (email: any, password: any) => Promise<void>;
    signOut: () => void;
}

const AuthContext = createContext<Partial<AuthProps>>({})

export function AuthProvider({ children }) {
    const auth = useProvideAuth() 
    return <AuthContext.Provider value={auth}>{ children }</AuthContext.Provider>
}

export const useAuth = () => {
    return useContext(AuthContext)
}

function useProvideAuth() {
    const client = useApolloClient();
    const router = useRouter();

    const [error, setError] = useState('')

    const { data } = useCurrentUserQuery({
        fetchPolicy: 'network-only',
        errorPolicy: 'ignore',
    });


    let user = data && data.currentUser;

    // Singing in and signing up
    const [signInMutation] = useSignInMutation();
    const [signUpMutation] = useSignUpMutation();
    const [signOutMutaion] = useSignOutMutation();
    const signIn = async (email, password) => {
        // debugger
        try {
            const { data } = await signInMutation({ variables: { email, password } });
           
            if (data.login.user) {
                user = data.login.user
                client.resetStore().then(() => {
                    router.push('/streams')
                })
            } else {
                setError('Invalid Login')
            }
        } catch (error) {
            console.log(error)
            setError(error.message)
        }
    }

    const signUp = async (email, password) => {
        try {
            const { data } = await signUpMutation({ variables: { email, password } });
            if (data.register.user) {
                user = data.register.user;
                client.resetStore().then(() => {
                    router.push('/')
                })
            } else {
                setError('Error registering')
            }
        } catch (error) {
            setError(error.message)
        }
    }

    const signOut = async () => {
        await signOutMutaion();
        user = null;
        client.resetStore().then(() => {
            router.push('/auth/signin')
        })
    }

    return {
        user,
        error,
        signIn,
        signOut,
        signUp
    }
}


