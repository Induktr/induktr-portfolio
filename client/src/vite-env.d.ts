/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly DATABASE_URL: string;
  readonly TELEGRAM_BOT_TOKEN: string;
  readonly MY_CHAT_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
