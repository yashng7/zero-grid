# ZEROGRID - Cybersecurity Issue Management Platform

A full-stack Next.js application for managing security incidents with custom JWT authentication, rate limiting, and email notifications.

## Features

- 🔐 Custom JWT authentication (no third-party services)
- 📊 Issue tracking (Cloud Security, VAPT, Reteam Assessment)
- ⚡ Rate limiting (100 req/15min)
- 📧 Email notifications (Resend)
- 🎨 Modern cybersecurity-themed UI
- 🔄 Real-time updates and filtering
- 🛡️ Password reset functionality

## Tech Stack

**Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS  
**Backend:** Next.js API Routes (OOP), Drizzle ORM, PostgreSQL  
**Auth:** JWT + bcrypt  
**Email:** Resend

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database (Supabase recommended)
- Resend API key

### Installation
```bash
# Clone repository
git clone https://github.com/yashng7/zero-grid.git
cd zero-grid

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your credentials

# Run database migrations
npm run db:push

# Start development server
npm run dev
```

Visit `http://localhost:3000`

## Environment Variables
```env
DATABASE_URL="postgresql://user:password@host:5432/db"
JWT_SECRET="your-secret-key-min-32-chars"
JWT_REFRESH_SECRET="your-refresh-secret"
RESEND_API_KEY="re_your_api_key"
RESEND_FROM_EMAIL="onboarding@resend.dev"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Issues
- `GET /api/issues` - List issues (filter: `?type=cloud-security`)
- `POST /api/issues` - Create issue
- `GET /api/issues/[id]` - Get issue
- `PUT /api/issues/[id]` - Update issue
- `DELETE /api/issues/[id]` - Delete issue

### Profile
- `GET /api/users/profile` - Get profile
- `PUT /api/users/profile` - Update profile

## Project Structure
```
apnisec-app/
├── app/                    # Next.js pages
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard page
│   ├── login/            # Login page
│   └── profile/          # Profile page
├── lib/                   # Backend logic
│   ├── handlers/         # Request handlers
│   ├── services/         # Business logic
│   ├── db/              # Database schema
│   ├── validators.ts    # Input validation
│   ├── rate-limiter.ts  # Rate limiting
│   └── email.ts         # Email service
└── drizzle/             # Database migrations
```

## OOP Architecture

Backend follows strict OOP principles:
- **Handlers** - HTTP request/response
- **Services** - Business logic
- **Repositories** - Data access
- **Validators** - Input validation
- **Middleware** - Authentication

## Deployment

### Vercel (Recommended)
```bash
# Push to GitHub
git push origin main

# Deploy to Vercel
vercel --prod
```

Add environment variables in Vercel dashboard.

## Features Demo

**Register/Login** → **Create Issues** → **Track & Update** → **Manage Profile**


## License

MIT

## Author

Yashwant Gawande - [GitHub](https://github.com/yashng7)

## Assignment

Built as part of SDE Intern assignment for ApniSec.

**Requirements Met:**
- ✅ Custom JWT authentication
- ✅ Full OOP backend structure
- ✅ Rate limiting with headers
- ✅ Email integration
- ✅ Issue management CRUD
- ✅ SEO optimized (80%+)
- ✅ Deployed to production