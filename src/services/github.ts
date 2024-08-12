import axios from 'axios';
import axiosRetry from 'axios-retry';
import { config } from 'dotenv';

config();

const GITHUB_API_URL = process.env.GITHUB_API_URL || 'https://api.github.com';
const GITHUB_ACCESS_TOKEN = process.env.GITHUB_ACCESS_TOKEN;


axiosRetry(axios, {
  retries: 3,
  retryDelay: (retryCount) => {
    console.log(`Retrying request... Attempt #${retryCount}`);
    return axiosRetry.exponentialDelay(retryCount);
  },
  retryCondition: (error) => {
    switch (error.response?.status) {
      //retry only if status is 403,408,500 0r 501
      case 403:
      case 408:
      case 500:
      case 501:
        return true;
      default:
        return false;
      }
  }
});

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
