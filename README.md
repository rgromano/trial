# Job Board

Minimal code base for a pay-per-post job board built with Next.js 14 and Prisma.

## Deployment (≤10 min)
1. `npm install`
2. Create `.env` with `DATABASE_URL` and Stripe keys.
3. Run `npx prisma migrate dev` to create tables.
4. `npm run seed` to load demo jobs.
5. `npm run dev` and open `http://localhost:3000`.

To deploy on Vercel:
- Import the repo and set env vars.
- Vercel will detect Next.js and deploy automatically.

### Packages
Recruiters purchase packages of 1, 5, 10 or 20 posts via Stripe Checkout. Metadata `credits` in the session defines how many postings to add on success.
