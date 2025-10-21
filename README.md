# ResumeMaker – Deployment Guide

This project consists of a React frontend and a Node/Express/Prisma backend.

---

## Quick Start – Local Development

1. Clone the repo and install dependencies in both `frontend` and `backend` folders.
2. Configure environment variables (see below).
3. Run the backend: 
   ```sh
   cd backend && npm run dev
   ```
4. Run the frontend:
   ```sh
   cd frontend && npm start
   ```
---

# 🚀 Production Deployment

## 1. Frontend (Vercel)

### Steps:
1. Go to https://vercel.com and import your GitHub/GitLab repo.
2. Select the `frontend` folder as the root directory.
3. Confirm that these settings are detected or set manually:
   - **Framework Preset:** Create React App
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`
4. Add the following environment variable **(in the Vercel dashboard, Project Settings → Environment Variables):**
   - `REACT_APP_API_URL` = `<Paste your deployed Render backend API URL, e.g., https://your-api.onrender.com/api>`
5. Deploy! Vercel will handle the rest.

## 2. Backend (Render)

### Steps:
1. Go to https://render.com and create a new Web Service.
2. Connect your repo and select the `backend` folder as the root.
3. Set up these options:
   - **Environment:** Node
   - **Build Command:** `npm install && npm run build && npx prisma migrate deploy`
   - **Start Command:** `npm start`
4. Add your environment variables (see below) in the Render dashboard.
5. Deploy! Render will build and serve your API.

### Typical Backend Environment Variables:
Create a `.env` file in `backend/` or fill these into Render's panel:
```
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DBNAME
JWT_SECRET=supersecretvalue
# Add any others as needed
```
You MUST set `DATABASE_URL` (create a PostgreSQL database via Render dashboard or other provider).

## 3. Set up API URL for Frontend ↔ Backend
- On Render, after deploying backend, copy the live URL (e.g., `https://your-api.onrender.com`).
- Paste this as `REACT_APP_API_URL` in Vercel frontend settings as shown above.

---

## Environment Variable Templates

**Frontend (`.env` in `frontend/`, or Vercel dashboard):**
```
REACT_APP_API_URL=https://your-api.onrender.com/api
```

**Backend (`.env` in `backend/`, or Render dashboard):**
```
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DBNAME
JWT_SECRET=your-jwt-secret
```

---

## Notes
- **Frontend → Backend Calls:**
  - The frontend uses `REACT_APP_API_URL` for all API calls (see `frontend/src/api/axiosInstance.ts`). By setting this, you avoid any hardcoded localhost issues.
- **Prisma DB:** Make sure to run all migrations and seed your DB (Run: `npx prisma migrate deploy` and `npx prisma db seed` if you have a seed script).
- **CORS:**
  - In production, make sure your backend CORS policy allows requests from your deployed Vercel domain (Edit: `src/index.ts`, CORS origin).

---

## Done!
Enjoy your deployed ResumeMaker App!
