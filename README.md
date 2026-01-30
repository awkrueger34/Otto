# Otto - Your Personal AI Assistant

A white-label personal AI assistant SaaS that connects to users' Google Calendar, learns about their life, and helps them schedule/plan via chat.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), Tailwind CSS
- **Auth**: Clerk
- **Database**: PostgreSQL with Prisma ORM
- **AI**: Claude API (Anthropic)
- **Calendar**: Google Calendar API
- **Payments**: Stripe (coming soon)

## Getting Started

### 1. Clone and Install

```bash
git clone https://github.com/yourusername/otto.git
cd otto
npm install
```

### 2. Set Up Environment Variables

Copy the example env file:

```bash
cp .env.example .env.local
```

Then fill in your credentials:

#### Clerk (Auth)
1. Go to [clerk.com](https://clerk.com) and create a new application
2. Enable Google as a social login provider
3. Copy your API keys to `.env.local`

#### Database (PostgreSQL)
Options:
- **Railway**: [railway.app](https://railway.app) - Easy setup, free tier
- **Supabase**: [supabase.com](https://supabase.com) - Free tier, great UI
- **Neon**: [neon.tech](https://neon.tech) - Serverless PostgreSQL

Copy your database URL to `DATABASE_URL` in `.env.local`

#### Anthropic (AI)
1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Create an API key
3. Copy to `ANTHROPIC_API_KEY`

#### Google Calendar (Optional for MVP)
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable Google Calendar API
4. Create OAuth credentials
5. Copy client ID and secret to `.env.local`

### 3. Set Up Database

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# (Optional) Open Prisma Studio to view data
npx prisma studio
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
otto-mvp/
├── prisma/
│   └── schema.prisma      # Database schema
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── chat/      # Claude chat API
│   │   │   └── waitlist/  # Waitlist signup
│   │   ├── chat/          # Chat interface
│   │   ├── dashboard/     # User dashboard
│   │   │   └── profile/   # Profile settings
│   │   ├── sign-in/       # Clerk sign in
│   │   ├── sign-up/       # Clerk sign up
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx       # Landing page
│   ├── components/        # Shared components
│   ├── lib/
│   │   └── prisma.ts      # Prisma client
│   └── middleware.ts      # Clerk auth middleware
├── .env.example
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repo
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production

Make sure to set all variables from `.env.example` in your Vercel project settings.

## Features

### MVP (Current)
- [x] Landing page with waitlist
- [x] User authentication (Clerk)
- [x] Dashboard with setup checklist
- [x] Web chat interface with Claude
- [x] User profile/context settings
- [x] Database schema for users, profiles, chat history

### Coming Soon
- [ ] Google Calendar OAuth integration
- [ ] Calendar read/write from chat
- [ ] Daily email briefings
- [ ] Discord bot integration
- [ ] Telegram bot integration
- [ ] Stripe payments
- [ ] Usage tracking and limits

## Development

### Adding New Features

1. Update Prisma schema if needed
2. Run `npx prisma db push` to sync database
3. Create new API routes in `src/app/api/`
4. Create new pages in `src/app/`

### Database Migrations

```bash
# Create a migration
npx prisma migrate dev --name your_migration_name

# Apply migrations in production
npx prisma migrate deploy
```

## License

MIT

---

Built with ❤️ by Aaron
