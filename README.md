# Mina Tidtabeller

A Next.js application for tracking train timetables with real-time traffic information from Trafikverket, integrated with SJ.se booking flow.

## Features

- 🚂 Real-time train departure information from Trafikverket API
- ⚠️ Traffic alerts (delays, cancellations)
- 💾 Save favorite timetables locally
- 🔄 Bidirectional route grouping
- 🎫 Direct links to SJ.se booking flow
- 🎨 Built with SJ AB Component Library design system

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Internal Documentation

This project contains internal documentation in the `/docs` folder (excluded from git). This includes:
- API research notes
- Integration strategies
- Sensitive implementation details

**Note:** The `/docs` folder is gitignored and should not be committed to the repository.
