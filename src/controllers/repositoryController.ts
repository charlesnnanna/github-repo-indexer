import { Request, Response } from 'express';
import db from '../config/database';

export const getTopAuthors = async (req: Request, res: Response) => {
  const { repositoryName, repoAuthor } = req.params;
  const { limit } = req.query;

  const authors = await db('commits')
    .select('author_name')
    .count('author_name as commit_count')
    .join('repositories', 'commits.repository_id', '=', 'repositories.id')
    .where('repositories.name', repositoryName)
    .groupBy('author_name')
    .orderBy('commit_count', 'desc')
    .limit(Number(limit));
    
    console.log(authors)

  res.json(authors);
};

export const getCommits = async (req: Request, res: Response) => {
  const { repositoryName } = req.params;

  const commits = await db('commits')
    .select('*')
    .join('repositories', 'commits.repository_id', '=', 'repositories.id')
    .where('repositories.name', repositoryName);

  res.json(commits);
};
