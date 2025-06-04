# Job Board Route Map

| Path | Component/Page | Auth |
| ---- | -------------- | ---- |
| `/` | Landing | Public |
| `/jobs` | JobListPage | Public |
| `/jobs/[id]` | JobDetailPage | Public |
| `/jobs/new` | JobFormPage | Recruiter only |
| `/dashboard` | RecruiterDashboard | Recruiter only |
| `/admin` | AdminDashboard | Admin only |
| `/api/stripe/webhook` | Webhook route | - |

## Components
- `JobListPage`: lists jobs with search and filters using `prisma/job.findMany`.
- `JobFormPage`: form to create jobs. Uses Zod for validation.
- `Dashboard`: shows posting credits and stats.
