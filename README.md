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

Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Build for Production

```bash
npm run build
npm start
```
