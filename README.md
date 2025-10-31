# ResumeMaker – Local Development Setup

## 1. Clone the Project
```sh
git clone <your-repo-url>
cd resumemaker
```

## 2. Install Dependencies

**Backend:**
```sh
cd backend
npm install
```

**Frontend:**
```sh
cd ../frontend
npm install
```

## 3. Setup Environment Variables

### Backend (`backend/.env`)
Create a file named `.env` in the `backend/` directory:

```dotenv
# backend/.env.example
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/resumemaker
JWT_SECRET=mysupersecretkey
```
- **DATABASE_URL:** Use your local Postgres database connection string.
- **JWT_SECRET:** Any random string for signing tokens.
- **JWT_EXPIRES_IN=7d** 

---

### Frontend (`frontend/.env`)
Create a file named `.env` in the `frontend/` directory:

```dotenv
# frontend/.env.example
REACT_APP_API_URL=http://localhost:5000/api
```
- **REACT_APP_API_URL:** Should point to your backend API during local dev.

---

## 4. Set Up the Database (Backend)
From the `backend/` folder, run:
```sh
npx prisma migrate dev --name init
npx prisma db seed   # (if you have a seed script)
```

## 5. Run the Apps

**Backend:**
```sh
cd backend
npm run dev
```
Runs at [http://localhost:5000](http://localhost:5000)

**Frontend:**
```sh
cd frontend
npm start
```
Runs at [http://localhost:3000](http://localhost:3000)

## 6. Usage

- Open [http://localhost:3000](http://localhost:3000) in your browser.
- Your backend API will be available at [http://localhost:5000/api](http://localhost:5000/api).

---

With these steps and the embedded example `.env` content, your README now ensures onboarding and setup is easy for anyone!

---

## 7. Deploy (Easy) – Render

This repo includes a `render.yaml` for one‑click setup of the backend and a managed Postgres database on Render.

Steps:

1. Push this repository to GitHub.
2. Go to Render and select New → Blueprint → Connect your repo.
3. Render will detect `render.yaml` and provision:
   - Web service: `resumemaker-backend`
   - Database: `resumemaker-db`
4. On first deploy Render will run:
   - `npm install` then `npm run build` (which runs `prisma generate` and `tsc`)
   - Start command runs `prisma migrate deploy` and boots the server
5. Set `CORS_ORIGIN` in the Render service to your frontend URL (e.g. `https://your-frontend-domain`).

Notes:
- Node version is pinned via `engines` to 20.x to avoid TypeScript/runtime mismatches.
- Prisma uses `DATABASE_URL` from the managed DB automatically (wired in `render.yaml`).
- For local env examples, see `backend/env.example`.
