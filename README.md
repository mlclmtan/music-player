# TODO

1. REDUX
2. Prev track button for shuffle mode
3. Load all TRACK duration from mp3
4. Add Loop feat
5. Add category feat
6. [Add list animation](https://motion.ant.design/api/queue-anim)
7.  Integrate soundcloud/youtube stream (utilise BFF, SSC)
8.  Add lyrics
9.  SSR main UI
10. Refactor CSS

# BUG

1. After clicking next song, playing icon not animating
2. Dev mode: clicking next too fast, got error play() was interrupted by new load request
3. Song ended not auto to next song? fixed

# Corner Case

1. When switching from shuffle on to off, current playing song might duplicate with previous state of original sequence playlist.

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

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

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

