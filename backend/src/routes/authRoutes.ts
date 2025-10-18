import express from "express";
import { ensureGoogleUser } from "../controllers/authController";

const router = express.Router();

// Google OAuth signup/login route
router.post("/google", ensureGoogleUser);

export default router;
