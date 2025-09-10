# SeekPoint AI - AI Recruiting Platform

A Next.js application that enables recruiters to find and rank candidates through AI-powered sourcing and grading.

## Features

- **3-Step AI Search Process**: Submit recruiting brief → Confirm grading dimensions → Get ranked candidate results
- **File Upload Support**: Upload supporting documents via Supabase Storage
- **Intelligent Grading**: AI-suggested grading dimensions with customizable importance weights for recruiting
- **Webhook Integration**: n8n workflow automation for candidate sourcing and processing
- **Real-time Status Tracking**: Monitor search progress and access candidate results
- **Recruiting-Focused**: Built specifically for recruiters with role fit, technical skills, domain, and team fit dimensions

## Tech Stack

- **Frontend**: Next.js 14 with App Router, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API routes, Drizzle ORM, PostgreSQL
- **Storage**: Supabase Storage for file attachments
- **Integration**: n8n webhooks for AI processing workflows

## Setup Instructions

### 1. Environment Setup

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in your environment variables:
   - `DATABASE_URL`: PostgreSQL connection string
   - `SUPABASE_URL` & `SUPABASE_SERVICE_ROLE_KEY`: From your Supabase project
   - `WEBHOOK_SECRET`: Secure secret for webhook verification
   - `N8N_START_URL`: Your n8n webhook endpoint for candidate processing

### 2. Database Setup

1. Generate database schema:
   ```bash
   npm run db:generate
   ```

2. Run migrations:
   ```bash
   npm run db:migrate
   ```

### 3. Supabase Storage Setup

1. In your Supabase project, create a storage bucket named `attachments`
2. Configure bucket permissions as needed for your use case

### 4. Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Architecture

### Database Schema

- **searches**: Main search records with recruiting brief and grading configuration
- **attachments**: File uploads linked to searches
- **events**: Audit trail of search lifecycle events
- **criteria**: Extended recruiting criteria (job title, seniority, location, keywords, etc.)

### API Endpoints

- `POST /api/searches` - Create new search with file uploads
- `POST /api/searches/[id]/confirm-grading` - Confirm analysis dimensions and start processing
- `POST /api/webhooks/n8n/search-updated` - Receive n8n processing updates

### Security

- HMAC signature verification for webhook endpoints
- Server-only Supabase service role key usage
- Input validation with Zod schemas
- File upload restrictions and validation

## Deployment 

1. Build the application:
   ```bash
   npm run build
   ```

2. Deploy to your preferred platform (Vercel, Railway, etc.)
3. Ensure environment variables are configured in production
4. Run database migrations in production environment

## n8n Integration

The application integrates with n8n for AI candidate sourcing and processing workflows:

1. Set up an n8n webhook that accepts the search data
2. Configure your AI analysis workflow in n8n
3. Use the search update webhook to report results back to the application

Example n8n webhook payload:
```json
{
  "search_id": "uuid",
  "job_title": "Senior Backend Engineer",
  "job_description": "Business context...",
  "criteria": {
    "seniority": "senior",
    "location_preference": "EU Remote",
    "must_have_keywords": "Python, AWS",
    "nice_to_have_keywords": "Docker, GraphQL"
  },
  "dimensions": [...],
  "weights": {...},
  "contact": { "name": "...", "email": "..." }
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details