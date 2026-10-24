# Putting Prep237 online

This guide uses **Railway** (railway.com): it runs the site and its PostgreSQL database
together, deploys automatically from GitHub, and provides HTTPS for your own domain. Any
host that runs Node.js 20+ with PostgreSQL works the same way (Render, Fly.io, a VPS).
Hosting screens change often; if a button has moved, look for the same setting nearby.

## What the site needs

| Setting           | Value                                                         |
| ----------------- | ------------------------------------------------------------- |
| Build command     | `npm run build`                                               |
| Start command     | `npm run start:production` (applies database updates, starts) |
| Health check path | `/api/health`                                                 |
| Node.js           | 20.18 or newer                                                |

### Environment variables

| Variable              | Value                                                                |
| --------------------- | -------------------------------------------------------------------- |
| `DATABASE_URL`        | From the PostgreSQL service (Railway can link it for you)            |
| `APP_URL`             | `https://gceprep237.com` (the public address, with https)            |
| `CAMPAY_ENVIRONMENT`  | `demo` while testing, `live` to take real payments                   |
| `CAMPAY_APP_USERNAME` | From the CamPay application page (live app for `live`)               |
| `CAMPAY_APP_PASSWORD` | From the CamPay application page                                     |
| `CAMPAY_WEBHOOK_KEY`  | From the CamPay application page                                     |
| `SUPPORT_WHATSAPP`    | Optional. Overrides the support WhatsApp number in `src/lib/site.ts` |

Paste every value exactly, with no quotes, brackets or spaces. The server checks this when
it starts and refuses to run, with a message naming the problem, if something is missing
or malformed.

## Steps

1. **Merge the work into `main`** on GitHub so the host deploys a stable branch.
2. **Create the project.** In Railway: New Project → Deploy from GitHub repo → choose
   `mathscodewebsite`, branch `main`.
3. **Add the database.** In the same project: New → Database → PostgreSQL. In the site
   service's Variables, add `DATABASE_URL` referencing the database's URL.
4. **Add the other variables** from the table above. Start with `CAMPAY_ENVIRONMENT=demo`.
5. **Set the commands.** In the site service's Settings: start command
   `npm run start:production`, health check path `/api/health`. Deploy.
6. **Create the subjects and topics** (once), from the service's shell / one-off command:

   ```bash
   SEED_SAMPLE_CONTENT=false npm run db:seed
   ```

   Leave out `SEED_SAMPLE_CONTENT=false` only on a test copy, where sample questions and a
   demo test are useful.

7. **Make yourself admin.** Open the site, register with your phone number, then in the
   shell:

   ```bash
   npm run admin:grant -- 676999221
   ```

8. **Connect the domain.** Buy `gceprep237.com` from a registrar (Namecheap, Cloudflare,
   GoDaddy…). In Railway: Settings → Networking → Custom domain → `gceprep237.com`, then add
   the DNS records Railway shows at your registrar. HTTPS is set up automatically once DNS
   has updated (minutes to a few hours). Make sure `APP_URL` matches.
9. **Connect CamPay.** In the CamPay application settings, set the webhook URL to
   `https://gceprep237.com/api/payments/campay`.
10. **Go live with payments.** Replace the three CamPay values with your **live** app's
    values, set `CAMPAY_ENVIRONMENT=live`, redeploy, then from the shell send yourself a
    small real payment:

    ```bash
    npm run payments:smoke -- 676999221 25
    ```

## Before announcing the launch

- [ ] Health check is green at `https://gceprep237.com/api/health`
- [ ] Registration, login and password change work on a phone
- [ ] A real subscription payment completes and shows the end date
- [ ] Notes and questions for the first weeks are published
- [ ] The first weekly test is scheduled
- [ ] Terms and conditions for prizes are published (see docs/SPEC.md)
- [ ] Automatic database backups are on in the host's database settings

## Updating the site

Every push to `main` deploys automatically. Database changes in `prisma/migrations` are
applied by the start command before the new version takes traffic.
