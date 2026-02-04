# UO Outlands Guild Drawing System

A Next.js application for conducting monthly prize drawings for Ultima Online Outlands guild members.

## How It Works

1. **Add Players**: Enter player names and their number of entries (earned through guild activities)
2. **Add Prizes**: List the prizes to be awarded
3. **Conduct Drawing**: 
   - Each player entry generates a random number (1-1000)
   - Each player's highest roll is their final score
   - Players are ranked by highest roll (descending)
   - Top ranked players win prizes in order

## Getting Started

Install dependencies:
```bash
npm install
```

Create a `.env.local` file with required environment variables:
```bash
ADMIN_PASSWORD=your-password-here
SESSION_SECRET=your-secret-key-here
BLOB_READ_WRITE_TOKEN=your-vercel-blob-token
```

Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

This app uses Vercel Blob for persistent storage of drawing results.

1. Deploy to Vercel (connects to your GitHub repo)
2. Add environment variables in Vercel dashboard
3. Create a Vercel Blob store in the Storage tab
4. Pull environment variables locally: `vercel env pull`

## Build for Production

```bash
npm run build
npm start
```

## TODO

- [ ] **Migrate from proxy.ts to Next.js 15+ auth patterns** - Currently using the `proxy.ts` file convention (formerly `middleware.ts`) for authentication. For long-term maintainability, consider migrating to:
  - Server Actions for login/logout
  - Route handlers with proper auth checks
  - Layout-level authentication
  - See: https://nextjs.org/docs/messages/middleware-to-proxy
