import db from '../config/database';
import { fetchRepositoryData, fetchCommits } from './github';

export const saveRepositoryData = async (repoName: string, author: string) => {

  const existingRepo = await db('repositories').where({ name: repoName, author: author}).first();

  if(!existingRepo){
    const repoData = await fetchRepositoryData(repoName, author);
    const [repositoryId] = await db('repositories').insert({
      name: repoData.name,
      description: repoData.description || 'No description provided',
      url: repoData.html_url,
      language: repoData.language || 'Unknown',
      forks_count: repoData.forks_count || 0,
      stars_count: repoData.stargazers_count || 0,
      open_issues_count: repoData.open_issues_count || 0,
      watchers_count: repoData.watchers_count || 0,
      author: repoData.owner.login,
      time_of_first_commit: repoData.created_at
    }).returning('id');
    return repositoryId;
  } else {
    return existingRepo.repository_id
  }
};

export const saveCommits = async (repoName: string, author: string, since?: string) => {

  const repository = await db('repositories').where({ name: repoName, author: author}).first();

  if (!repository) {
    throw new Error(`Repository ${repoName} not found`);
  }

  const lastCommit = await db('commits').where({repository_id: repository.id}).first()

  if(!lastCommit){
    const commits = await fetchCommits(repoName, author, repository.time_of_first_commit);

    const commitPromises = commits.map(async (commit: any) => {
      return db('commits').insert({
        repository_id: repository.id,
        commit_message: commit.commit.message || 'No commit message',
        author_name: commit.commit.author.name,
        author_email: commit.commit.author.email,
        commit_date: commit.commit.author.date,
        commit_url: commit.html_url,
      });
    });
  
    await Promise.all(commitPromises); 
  } else {
    const commits = await fetchCommits(repoName, author, lastCommit.commit_date);
    const newCommits = commits.slice(0, -1)

    if(newCommits){
      const commitPromises = newCommits.map(async (commit: any) => {

      const exists = await db('commits')
      .where({ commit_url: commit.html_url })
      .first();

      if(!exists){
        return db('commits').insert({
          repository_id: repository.id,
          commit_message: commit.commit.message,
          author_name: commit.commit.author.name,
          author_email: commit.commit.author.email,
          commit_date: commit.commit.author.date,
          commit_url: commit.html_url,
        });
      }
      });
      await Promise.all(commitPromises); 

    }
  }
};

export const resetCommits = async (repoName: string) => {
  const repository = await db('repositories').where({ name: repoName }).first();
  
  if (!repository) {
    throw new Error(`Repository ${repoName} not found`);
  }
  
  await db('commits').where({ repository_id: repository.id }).del();
};
