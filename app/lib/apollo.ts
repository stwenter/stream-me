import { useMemo } from 'react'
import { ApolloClient, InMemoryCache, HttpLink, NormalizedCacheObject } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'

let apolloClient: ApolloClient<NormalizedCacheObject> | undefined;

function createApolloClient() {
    const authLink = setContext((_, { headers }) => {
        // getting auth token from stroage if exists
        const token = sessionStorage.getItem('token');
        // return headers so httpLink can read them
        return {
            headers: {
                ...headers,
                authorization: token ? `Bearer ${token}` : '',
            }
        }
    });

    const httpLink = new HttpLink({ 
        uri: '/graphql',
        credentials: 'include'
    })

    return new ApolloClient({
        link: authLink.concat(httpLink),
        cache: new InMemoryCache()
    })
}

// initialize apollo client with context and initial statuses
export function initializeApollo(initialState: any = null) {
    const _apolloClient = apolloClient ?? createApolloClient();

    if (initialState) {
        _apolloClient.cache.restore(initialState);
    }

    // fro ssr or ssg always create new Apollo Client
    if (typeof window === 'undefined') {
        return _apolloClient;
    }

    if (!apolloClient) {
        apolloClient = _apolloClient;
    }

    return _apolloClient;
}

export function useApollo(initialState: any) {
    const store = useMemo(() => {
       return initializeApollo(initialState)
    }, [initialState])
    return store;
}