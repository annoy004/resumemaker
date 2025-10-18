import { Router } from "express";
import { googleAuth, logout } from "../controllers/authController";
import { verifyAuth } from "../middleware/authMiddleware";

const router = Router();

// Google login
router.post("/google", googleAuth);

// ✅ Check if user is logged in (from cookie)
router.get("/me", verifyAuth, (req, res) => {
  res.json({ user: (req as any).user });
});

// ✅ Logout route
router.post("/logout", logout);

export default router;
