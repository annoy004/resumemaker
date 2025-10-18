import { Router } from 'express';
import {
  createResume, listResumes, getResume,
  updateResume, deleteResume, publishResume, getPublicResume
} from '../controllers/resumeControllers';

const router = Router();

router.get('/', listResumes);
router.post('/', createResume);
router.get('/:id', getResume);
router.put('/:id', updateResume);
router.delete('/:id', deleteResume);
router.post('/:id/publish', publishResume);

// public view
router.get('/public/:slug', getPublicResume);

export default router;
