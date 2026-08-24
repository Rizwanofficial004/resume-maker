# ResumeMaster — AI-Powered Resume Builder

A full-stack resume builder inspired by BetterCV, with a more professional and user-friendly design.

Build professional, ATS-friendly resumes in minutes with:
- 6 professional resume templates (Modern, Classic, Minimal, Professional, Creative, Executive)
- AI writing assistant (powered by **OpenRouter**) — improves bullets, generates summaries & cover letters, suggests ATS keywords
- Live resume preview with accent color, font, and template switching
- **PDF export** (browser print) and **Word (.doc) export**
- Cover letter builder with AI generation
- Job search page
- User accounts with JWT auth, saved resumes & cover letters (MongoDB)

## Tech Stack

| Layer    | Tech |
|----------|------|
| Frontend | Next.js 14 (App Router), React 18, Tailwind CSS, lucide-react |
| Backend  | Node.js, Express, MongoDB (Mongoose), JWT auth, bcrypt |
| AI       | OpenRouter API (model configurable) |

## Project Structure

```
resume-maker/
├── backend/               # Express + MongoDB API (port 5000)
│   └── src/
│       ├── index.js       # entry point
│       ├── config/db.js
│       ├── models/        # User, Resume, CoverLetter
│       ├── controllers/   # auth, resume, coverLetter, ai
│       ├── routes/        # auth, resume, cover-letter, ai, jobs, templates
│       ├── middleware/    # JWT auth, error handling
│       └── utils/openrouter.js
└── frontend/              # Next.js app (port 3010)
    └── src/
        ├── app/           # pages: landing, auth, dashboard, editor, cover letters, jobs
        ├── components/    # UI + editor section editors
        ├── templates/     # resume template renderers (print-ready)
        └── lib/           # api client, auth context, data helpers, export utils
```

## Getting Started

### 1. Start MongoDB (Docker)

```bash
docker run -d --name resumemaster-mongo \
  -p 27017:27017 \
  -v resumemaster-mongo-data:/data/db \
  mongo:7
```

Or use your own MongoDB Atlas cluster (update `backend/.env` with `MONGO_URI`).

### 2. Configure the backend

```bash
cd backend
cp .env.example .env
# Edit .env — add your OpenRouter API key:
#   OPENROUTER_API_KEY=sk-or-v1-...
#   OPENROUTER_MODEL=openai/gpt-4o-mini
npm install
npm run dev        # starts on http://localhost:5000
```

### 3. Run the frontend

```bash
cd frontend
npm install
npm run dev        # starts on http://localhost:3010
```

Open **http://localhost:3010** and register an account.

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | – | Register a user |
| POST | `/api/auth/login` | – | Log in, get JWT |
| GET | `/api/auth/me` | ✓ | Current user |
| GET/POST | `/api/resumes` | ✓ | List / create resumes |
| GET/PUT/DELETE | `/api/resumes/:id` | ✓ | Get / update / delete |
| POST | `/api/resumes/:id/duplicate` | ✓ | Duplicate a resume |
| GET/POST | `/api/cover-letters` | ✓ | List / create cover letters |
| GET/PUT/DELETE | `/api/cover-letters/:id` | ✓ | Manage a cover letter |
| POST | `/api/ai/improve` | ✓ | Improve a bullet / text (1 credit) |
| POST | `/api/ai/summary` | ✓ | Generate professional summary |
| POST | `/api/ai/bullets` | ✓ | Suggest achievement bullets |
| POST | `/api/ai/cover-letter` | ✓ | Generate a cover letter |
| POST | `/api/ai/keywords` | ✓ | Suggest ATS keywords |
| GET | `/api/jobs` | – | Search jobs (mock data) |
| GET | `/api/templates` | – | Template metadata |

## AI Credits

Each user starts with **20 AI credits** (`aiCredits` field). Every AI call consumes one credit.
When credits run out, the API returns `402 Payment Required` — you can reset/raise credits in the
MongoDB `users` collection or adjust the limit in `backend/src/models/User.js`.

## PDF & Word Export

- **PDF**: click the *PDF* button (opens the browser print dialog → *Save as PDF*). The resume is
  rendered at exact A4 size via `#print-resume-holder` (see `frontend/src/app/globals.css`).
- **Word**: click the *Word* button — downloads a Word-compatible HTML `.doc` file that opens in
  Microsoft Word / Google Docs and remains editable.

## Templates

Templates live in `frontend/src/templates/` — each is a React component rendering print-ready HTML
at `210mm × 297mm`. Add a new template by creating a component and registering it in `index.jsx`
(and optionally `backend/src/routes/templates.js`).

## Design Notes

- Palette: deep slate/navy + brand blue (`#3369fc`) accents on clean white.
- Landing page sections: hero with live resume previews, stats, template gallery, features, how it
  works, testimonials, AI/jobs banner, FAQ, CTA.
- The editor uses a live-scaled A4 preview that updates as you type, with auto-save (debounced 900ms).
- App name: **ResumeMaster** (formerly ResumeForge).
