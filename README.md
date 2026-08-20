# Induktr Portfolio

A premium portfolio and marketplace platform built with **Next.js 16+ (App Router)**, **Tailwind CSS v4**, and **Feature-Sliced Design (FSD)** architecture.

## 🚀 Features

- **Modern Tech Stack**: Next.js 16, React 19, Redux Toolkit, React Query.
- **Micro-Animations**: Dynamic interaction with Framer Motion.
- **Integrated Marketplace**: Purchase and view templates with advanced filtering.
- **Admin Dashboard**: Secure management of projects, tools, and FAQ.
- **Resilient Telegram Bot**: Full async dispatcher, 100% serverless-safe lifecycle for Vercel, and standalone polling worker for Hugging Face Spaces / Docker.
- **i18n Support**: Full internationalization for English, Ukrainian, and Russian.
- **Database**: Drizzle ORM with Neon (PostgreSQL) with safe lazy connection.

## 🏗️ Architecture

Following the **Feature-Sliced Design (FSD)** methodology:
- `app/`: Routing and global layouts.
- `widgets/`: Complex UI compositions (e.g., Header, Footer, ToolGrid).
- `features/`: Specific user actions/functionality (e.g., telegram-bot, send-app, auth).
- `entities/`: Business logic and data structures (e.g., project, marketplace-item).
- `shared/`: Low-level components, hooks, assets, and database APIs.

## 🤖 Telegram Bot Deployment & Operation

The bot supports two robust operational modes:

### Mode 1: Vercel Serverless (Webhook)
1. Deploy the project to Vercel and set the environment variables in Vercel Project Settings:
   - `DATABASE_URL`
   - `TELEGRAM_BOT_TOKEN`
   - `TELEGRAM_CHAT_ID`
2. Configure the webhook by visiting in your browser or sending a GET request to:
   ```
   https://your-domain.vercel.app/api/webhook/telegram?setup=true
   ```
3. To inspect bot status and webhook health:
   ```
   https://your-domain.vercel.app/api/webhook/telegram
   ```

### Mode 2: Hugging Face Spaces / Docker (Polling Worker)
1. Create a **Docker Space** on Hugging Face.
2. The included `Dockerfile` automatically builds Next.js and exposes port `7860`.
3. Set the Repository Secrets / Environment Variables in Space Settings:
   - `DATABASE_URL`
   - `TELEGRAM_BOT_TOKEN`
   - `TELEGRAM_CHAT_ID`
4. To run the dedicated polling worker daemon locally or in background:
   ```bash
   npm run bot:poll
   ```

## 🛠️ Development

### Prerequisites
- Node.js 18+
- PostgreSQL database (Neon recommended)
- Telegram Bot Token (from [@BotFather](https://t.me/BotFather))

### Setup
1. Clone the repository.
2. `npm install`
3. Copy `.env.example` to `.env` and fill in the variables.
4. `npm run dev`

### Commands
- `npm run dev`: Start Next.js development server.
- `npm run build`: Build production bundle.
- `npm run start`: Start production server.
- `npm run typecheck`: Check TypeScript types.
- `npm run bot:poll`: Start standalone Telegram bot polling worker.
- `npm run lint`: Run ESLint.

## 📄 License
Custom license for Induktr Portfolio. See [Terms](/terms) for details.

