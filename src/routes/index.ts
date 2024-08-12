import express from 'express';
import { getTopAuthors, getCommits } from '../controllers/repositoryController';

const router = express.Router();

router.get('/repository/:repositoryName/top-authors', getTopAuthors);
router.get('/repository/:repositoryName/commits', getCommits);

export default router;
