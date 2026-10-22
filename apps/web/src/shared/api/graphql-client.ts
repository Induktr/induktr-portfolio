import { Client, cacheExchange, fetchExchange } from 'urql';

export const graphqlClient = new Client({
  url: import.meta.env.VITE_GRAPHQL_ENDPOINT || 'http://localhost:4000/graphql',
  exchanges: [cacheExchange, fetchExchange],
  fetchOptions: () => {
    // Inject Telegram initData if inside Telegram Mini App
    interface TelegramWindow extends Window {
      Telegram?: {
        WebApp?: {
          initData?: string;
        };
      };
    }
    const tgInitData =
      typeof window !== 'undefined'
        ? (window as unknown as TelegramWindow).Telegram?.WebApp?.initData
        : undefined;
    const headers: Record<string, string> = {};
    if (tgInitData) {
      headers['x-telegram-init-data'] = tgInitData;
    }
    return { headers };
  },
});
