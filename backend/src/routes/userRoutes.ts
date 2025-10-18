import { Router } from 'express';
import { ensureUser } from '../controllers/userControllers';
const router = Router();
router.post('/ensure', ensureUser);
export default router;
