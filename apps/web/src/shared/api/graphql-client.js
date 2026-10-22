import { Client, cacheExchange, fetchExchange } from 'urql';
export const graphqlClient = new Client({
    url: import.meta.env.VITE_GRAPHQL_ENDPOINT || 'http://localhost:4000/graphql',
    exchanges: [cacheExchange, fetchExchange],
    fetchOptions: () => {
        const tgInitData = typeof window !== 'undefined'
            ? window.Telegram?.WebApp?.initData
            : undefined;
        const headers = {};
        if (tgInitData) {
            headers['x-telegram-init-data'] = tgInitData;
        }
        return { headers };
    },
});
