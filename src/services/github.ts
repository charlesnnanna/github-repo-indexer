import axios from 'axios';
import { config } from 'dotenv';

config();

const GITHUB_API_URL = process.env.GITHUB_API_URL || 'https://api.github.com';
const GITHUB_ACCESS_TOKEN = process.env.GITHUB_ACCESS_TOKEN;

export const fetchRepositoryData = async (repoName: string, author: string) => {
  try {
    const response = await axios.get(`${GITHUB_API_URL}/repos/${author}/${repoName}`, {
      headers: {
        Authorization: `${GITHUB_ACCESS_TOKEN}`,
      },
    });
    return response.data;
  } catch (error:any) {
    throw new Error(`Error fetching repository data: ${error.message}`);
  }
};

export const fetchCommits = async (repoName: string, author:string, since?: string) => {
  try {
    const response = await axios.get(`${GITHUB_API_URL}/repos/${author}/${repoName}/commits`, {
      headers: {
        Authorization: `${GITHUB_ACCESS_TOKEN}`,
      },
      params: { since },
    });
    return response.data;
  } catch (error:any) {
    throw new Error(`Error fetching commits: ${error.message}`);
  }
};
