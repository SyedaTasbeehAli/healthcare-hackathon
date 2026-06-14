# MediVault AI

Frontend-only healthcare hackathon prototype for organizing medical records, extracting report text, generating AI-assisted summaries, searching uploaded records, and preparing doctor-friendly visit context.

## Features

- Upload PDF, JPG, JPEG, and PNG medical documents
- Extract readable PDF text and OCR image reports with Tesseract.js
- Generate AI-assisted report summaries through OpenRouter
- Store report metadata and summaries in browser `localStorage`
- Search processed medical records with natural-language queries
- Track current medicines
- Save basic medical profile details such as blood group, allergies, and chronic conditions
- Recommend a relevant doctor and appointment slot from local demo data
- Download a doctor-share summary from the dashboard

## Medical Safety

This app is a hackathon prototype. It does not provide medical advice, treatment, or a medical diagnosis. AI output is only for organizing records and preparing possible discussion points for a licensed clinician.

Use wording such as:

- AI-assisted summary
- Possible concerns
- Not a medical diagnosis

## Tech Stack

- React
- Vite
- Tailwind CSS
- React Router
- Lucide React icons
- Tesseract.js for browser OCR
- OpenRouter for LLM-powered summaries/search/routing
- Browser `localStorage` for prototype persistence

## Getting Started

Install dependencies:

```bash
npm install
```

Create a local `.env` file:

```bash
VITE_OPENROUTER_API_KEY=your_openrouter_key_here
```

Run the development server:

```bash
npm run dev
```

On Windows PowerShell, if `npm` scripts are blocked, use:

```powershell
npm.cmd run dev
```

Build for production:

```bash
npm run build
```

Or on Windows:

```powershell
npm.cmd run build
```

## API Key Notes

For local development, keep your OpenRouter key in `.env`.

For a Vercel demo, add this environment variable in Vercel:

```text
VITE_OPENROUTER_API_KEY
```

Then redeploy the app.

Important: because this is a frontend-only Vite app, any `VITE_` environment variable is exposed to browser-side code. For a hackathon demo, use a limited/budget-capped key. For production, route LLM calls through a backend or serverless function so the key is never exposed to users.

The app also supports a browser-local key entry flow on the Upload page. Reviewers can paste a temporary OpenRouter key there; it is stored only in that browser's `localStorage` and is not committed to the public repository.

## Project Structure

```text
src/
  components/       Reusable UI components
  config/           AI provider configuration
  context/          Shared app state providers
  data/             Demo/mock data
  pages/            Route-level pages
  services/         OCR, LLM, and OpenRouter helpers
  utils/            localStorage utilities
```

## Main Pages

- Dashboard: report stats, recent uploads, medicine snapshot, downloadable doctor summary
- Upload: document upload, OCR/AI processing, category filtering
- AI Summary: processed report summaries
- Timeline: medical activity timeline
- Search: natural-language search over processed reports
- Medicines: active medicine tracking
- Profile / Medical Profile: family profile and medical background details
- Book Appointment: AI-assisted doctor routing from local doctor/slot data

## Data Persistence

This project has no backend and no real database. Demo data and user-entered prototype data are stored in browser `localStorage`.

Clearing browser storage will remove uploaded report metadata, processed summaries, medicines, profile details, and any browser-saved API key.

## Deployment

The project can be deployed to Vercel as a standard Vite app.

Recommended Vercel setup:

- Build command: `npm run build`
- Output directory: `dist`
- Environment variable: `VITE_OPENROUTER_API_KEY` for demo-only LLM access

## Git Ignore

The repository should not commit local dependencies, builds, or secrets:

```text
node_modules/
dist/
.env
.env.local
.DS_Store
```
