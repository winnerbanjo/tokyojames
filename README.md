# TOKYO JAMES

Next.js storefront and MongoDB-backed admin. The sample catalog, sample orders, automatic seeding, browser-only login, and simulated payment flow have been removed. Brand image/video assets are retained.

## Local setup

Use Node.js 22.14 or newer. Run `npm ci`, copy `.env.example` to `.env.local`, and fill in a dedicated MongoDB URI, the site's public origin (`APP_URL`), an admin username, password hash, and a random session secret. Do not put credentials in Git or browser-exposed `NEXT_PUBLIC_` variables.

Generate a password hash with `npm run admin:password`: supply a password of at least 16 characters on standard input, then end input (Ctrl-D). Use a private terminal or a password-manager pipe; the command outputs only a salted scrypt hash. Generate the session secret with `openssl rand -hex 32`.

Run `npm run dev`. Sign in at `/admin`. With a fresh database the catalog and orders are empty. Add actual garments, images, descriptions, sizes, prices, availability, approved editorial copy, and contact details through admin. Prices are EUR only until currency conversion is configured and verified.

## Production readiness

**Online payments remain disabled. This is not yet ready to accept live sales.** `/api/orders` rejects creation, and the storefront never collects card details or claims a payment succeeded. Choose and integrate a payment provider, verify signed payment webhooks, calculate totals and stock on the server, and configure shipping/tax rules before enabling checkout. Add approved privacy, terms, shipping, and returns policies before taking orders.

Set all environment values in the deployment host and use HTTPS. `APP_URL` must exactly match the browser origin. Admin cookies are HTTP-only, Secure in production, SameSite=Strict, and expire after eight hours. Sessions are stored in MongoDB and revoked at logout. Rotate the session secret to invalidate all sessions. Login attempts have a shared database-backed limit of 20 per 15-minute window; configure an edge/WAF rate limit as well for public endpoints and request-body sizes. Multiple replicas share the same database and rate limit.

MongoDB is required; there are no memory or local-disk persistence fallbacks. Failed writes return errors. Content and uploaded images persist in MongoDB, including on serverless deployments. Uploads accept JPEG, PNG, or WebP signatures up to 5 MB. Configure MongoDB backups and monitor storage (images share the database). The orders dashboard shows the most recent 500 persisted orders; revenue counts only records explicitly marked `paymentStatus: paid`. Fulfillment actions await the payment integration.

## Existing demo database cleanup

Run `npm run demo:clean` with `MONGODB_URI` configured in `.env.local` or the deployment environment to preview exact unchanged sample products and lookbooks. Then run `npm run demo:clean -- --apply` to back up matched records under `backups/` and delete only those records. The command preserves modified records and can be safely rerun. Review any modified legacy products manually in admin. The old sample order existed only in process memory and disappears with the old deployment. No database cleanup runs automatically at startup.

Backups contain database records and must remain private. `backups/` is ignored by Git. Production cleanup has not been run as part of the source change; configure the intended database first.

## Verification

`npm run build` creates the production build. `npm test` starts an isolated temporary MongoDB database and the production server, runs API and browser checks, and then shuts both down. It never uses `MONGODB_URI` from your environment for its test data. It requires a Chromium browser (system Chrome is detected automatically; otherwise run `npx playwright install chromium`) and a MongoDB binary (downloaded by mongodb-memory-server when absent).

`npm audit` checks the locked dependencies. Test credentials are generated for each run and are not production credentials.
