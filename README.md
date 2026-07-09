# Taskora

**Earn money completing social media tasks.** Taskora connects brands who need real engagement with earners who complete tasks (follow, like, comment, share) and get paid instantly to their Nigerian bank account.

Built by [Abubakar Ibrahim (SadiqDev)](https://sadiqdev-portfolio.vercel.app/)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Laravel 12, PHP 8.2, Laravel Sanctum |
| Frontend | Next.js 16, React 19, Tailwind CSS v4 |
| Database | MySQL (local) / PostgreSQL (production) |
| Storage | Cloudinary (avatars + proof images) |
| Email | Resend |
| Payments | Paystack (NGN deposits + withdrawals) |
| Auth | Sanctum token auth + Google OAuth |

---

## Features

- **Earners** — browse 43+ task types across Instagram, TikTok, YouTube, Twitter, Facebook, complete tasks, submit screenshot proof, get paid to their bank account
- **Advertisers** — fund campaigns from wallet, set participants, task types have canonical prices enforced server-side
- **Wallet** — Paystack deposits, manual withdrawals (₦500 min), bank account verification via Paystack
- **Referral program** — ₦5 bonus per referred user (paid on email verification)
- **Admin dashboard** — user management, campaign CRUD, submission review, withdrawal processing, task type pricing editor
- **Leaderboard** — all time / monthly / weekly periods

---

## Local Development

### Prerequisites
- PHP 8.2+
- Composer 2
- Node.js 18+
- MySQL 8 or PostgreSQL

### Backend

```bash
cd backend
cp .env.example .env
# Fill in your credentials in .env
composer install
php artisan key:generate
php artisan migrate
php artisan db:seed --class=TaskTypeSeeder
php artisan serve
```

Backend runs at `http://localhost:8000`

### Frontend

```bash
cd frontend
cp .env.local.example .env.local
# Set NEXT_PUBLIC_API_URL=http://localhost:8000/api
npm install
npm run dev
```

Frontend runs at `http://localhost:3000`

---

## Deployment

### Backend → Render (Docker)

1. Connect your GitHub repo to [render.com](https://render.com)
2. Create a new **Web Service** → select **Docker** → point to `backend/Dockerfile`
3. Add a free **PostgreSQL** database and link it
4. Set these environment variables in the Render dashboard:

```
APP_KEY=          (generate with: php artisan key:generate --show)
RESEND_API_KEY=
PAYSTACK_SECRET_KEY=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
FRONTEND_URL=     (your Vercel/Render frontend URL)
```

All other variables are pre-configured in `render.yaml`.

The `start.sh` script automatically runs migrations and seeds task types on every deploy.

### Frontend → Vercel (recommended) or Render

**Vercel:**
```bash
vercel --cwd frontend
```
Set env var: `NEXT_PUBLIC_API_URL=https://taskora-backend.onrender.com/api`

**Render:**
Already configured in `render.yaml` under `taskora-frontend`.

### One-click deploy with render.yaml

If your repo root has `render.yaml`, Render can deploy both services at once:
- Go to Render dashboard → New → Blueprint
- Connect your repo — Render reads `render.yaml` automatically

---

## Email Setup (Resend)

On the **free plan**, Resend only sends to your own account email. To send to all users:

1. Go to [resend.com/domains](https://resend.com/domains)
2. Add `taskora.io` (or your domain)
3. Add the 3 DNS records to your domain provider
4. Set `RESEND_DOMAIN_VERIFIED=true` in your environment variables

Until then, verification and welcome emails only reach your Resend account email.

---

## Project Structure

```
Taskora/
├── backend/                  Laravel API
│   ├── app/
│   │   ├── Console/Commands/ Artisan commands (campaign expiry)
│   │   ├── Enums/            PHP 8.1 backed enums for all status fields
│   │   ├── Http/Controllers/ API controllers
│   │   ├── Models/           Eloquent models
│   │   └── Services/         Cloudinary, Email, Notification services
│   ├── database/
│   │   ├── migrations/       All table migrations
│   │   └── seeders/          TaskTypeSeeder (43 task types + prices)
│   ├── docker/               nginx, php-fpm, supervisord, start.sh
│   ├── Dockerfile            Production Docker image
│   └── routes/api.php        All API routes
│
├── frontend/                 Next.js app
│   ├── src/app/              Pages (App Router)
│   │   ├── (auth)/           Login, Register, Forgot Password
│   │   ├── admin/            Admin dashboard pages
│   │   ├── tasks/            Task browse + create + detail
│   │   ├── wallet/           Wallet + deposit pages
│   │   └── ...               Dashboard, leaderboard, profile, etc.
│   └── src/components/       Shared components
│
├── render.yaml               Render deployment config (both services)
└── README.md
```

---

## Admin Access

Create an admin account directly in the database:
```sql
UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
```

Or via artisan tinker:
```bash
php artisan tinker
App\Models\User::where('email', 'your@email.com')->update(['role' => 'admin']);
```

---

## License

MIT — built by [Abubakar Ibrahim (SadiqDev)](https://sadiqdev-portfolio.vercel.app/)
