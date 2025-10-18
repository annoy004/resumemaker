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
app.use(cookieParser()); // <--- parse cookies from client requests
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true, // <--- allow cookies to be sent
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
