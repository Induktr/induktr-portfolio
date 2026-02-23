# Induktr Portfolio

A premium portfolio and marketplace platform built with **Next.js 15+ (App Router)**, **Tailwind CSS v4**, and **Feature-Sliced Design (FSD)** architecture.

## 🚀 Features

- **Modern Tech Stack**: Next.js, React 19, Redux Toolkit, React Query.
- **Micro-Animations**: Dynamic interaction with Framer Motion.
- **Integrated Marketplace**: Purchase and view templates with advanced filtering.
- **Admin Dashboard**: Secure management of projects, tools, and FAQ.
- **Telegram Bot Integration**: Real-time notifications for leads and automated delivery.
- **i18n Support**: Full internationalization for English, Ukrainian, and Russian.
- **Database**: Drizzle ORM with Neon (PostgreSQL).

## 🏗️ Architecture

Following the **Feature-Sliced Design (FSD)** methodology:
- `app/`: Routing and global layouts.
- `pages/`: Page-level components.
- `widgets/`: Complex UI compositions (e.g., Header, Footer).
- `features/`: Specific user actions/functionality (e.g., auth, contact-form).
- `entities/`: Business logic and data structures (e.g., project, marketplace-item).
- `shared/`: Low-level components, hooks, assets, and APIs.

## 🛠️ Development

### Prerequisites
- Node.js 18+
- PostgreSQL database (Neon recommended)
- Telegram Bot Token (for notifications)

### Setup
1. Clone the repository.
2. `npm install`
3. Copy `.env.example` to `.env` and fill in the variables.
4. `npm run dev`

### Commands
- `npm run dev`: Start development server.
- `npm run build`: Build for production.
- `npm run start`: Start production server.
- `npm run lint`: Run ESLint.

## 📄 License
Custom license for Induktr Portfolio. See [Terms](/terms) for details.
