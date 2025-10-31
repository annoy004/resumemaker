import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import resumeRoutes from './routes/resumeRoutes';
import userRoutes from './routes/userRoutes';
import authRoutes from "./routes/authRoutes";
import { PrismaClient } from '@prisma/client';

dotenv.config();
const app = express();
const prisma = new PrismaClient();

// ✅ Database connection test
async function testDB() {
  try {
    await prisma.$connect();
    console.log("✅ Connected to PostgreSQL successfully!");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
}
testDB();

// ✅ Middleware
app.use(cookieParser());
app.use(express.json());

// CORS
const corsOriginsEnv = process.env.CORS_ORIGIN || "http://localhost:5173,http://localhost:3000";
const allowedOrigins = corsOriginsEnv.split(",").map((o) => o.trim()).filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// ✅ Routes
app.get('/', (_req, res) => res.send('API OK'));
app.use("/api/auth", authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/resumes', resumeRoutes);

// ✅ Global Error Handler (optional but recommended)
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("🔥 Server Error:", err);
  res.status(500).json({ error: err.message || "Internal Server Error" });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
