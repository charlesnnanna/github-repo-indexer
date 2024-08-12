import db from '../config/database';
import { fetchRepositoryData, fetchCommits } from './github';

export const saveRepositoryData = async (repoName: string, author: string) => {

  const existingRepo = await db('repositories').where({ name: repoName, author: author}).first();

  if(!existingRepo){
    const repoData = await fetchRepositoryData(repoName, author);
    console.log(repoData)
    const [repositoryId] = await db('repositories').insert({
      name: repoData.name,
      description: repoData.description,
      url: repoData.html_url,
      language: repoData.language,
      forks_count: repoData.forks_count,
      stars_count: repoData.stargazers_count,
      open_issues_count: repoData.open_issues_count,
      watchers_count: repoData.watchers_count,
      author: repoData.owner.login,
      time_of_first_commit: repoData.created_at
    }).returning('id');
    return repositoryId;
  } else {
    console.log(existingRepo)
    return existingRepo.repository_id
  }
};

export const saveCommits = async (repoName: string, author: string, since?: string) => {

  const repository = await db('repositories').where({ name: repoName, author: author}).first();

  if (!repository) {
    throw new Error(`Repository ${repoName} not found`);
  }

  const lastCommit = await db('commits').where({id: repository.id}).first()

  if(!lastCommit){
    const commits = await fetchCommits(repoName, author, repository.time_of_first_commit);
    console.log(commits, 'few or nothing') 

    const commitPromises = commits.map(async (commit: any) => {
      return db('commits').insert({
        repository_id: repository.id,
        commit_message: commit.commit.message,
        author_name: commit.commit.author.name,
        author_email: commit.commit.author.email,
        commit_date: commit.commit.author.date,
        commit_url: commit.html_url,
      });
    });
  
    await Promise.all(commitPromises); 
  } else {
    const commits = await fetchCommits(repoName, author, lastCommit.commit_date);
    console.log(commits)

    const commitPromises = commits.map(async (commit: any) => {
      return db('commits').insert({
        repository_id: repository.id,
        commit_message: commit.commit.message,
        author_name: commit.commit.author.name,
        author_email: commit.commit.author.email,
        commit_date: commit.commit.author.date,
        commit_url: commit.html_url,
      });
    });
  
    await Promise.all(commitPromises); 
  }
};

export const resetCommits = async (repoName: string) => {
  const repository = await db('repositories').where({ name: repoName }).first();
  
  if (!repository) {
    throw new Error(`Repository ${repoName} not found`);
  }
  
  await db('commits').where({ repository_id: repository.id }).del();
};
