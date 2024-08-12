import {parentPort} from 'worker_threads';
import { saveCommits, saveRepositoryData } from '../services/repository.js';


const fetchGithubData = async (repoName: string, author: string) => {
  try {
    await saveRepositoryData(repoName, author);
    await saveCommits(repoName, author);

    // After the initial fetch, start checking for updates every 10 minutes.
    setInterval(async () => {
      await saveCommits(repoName, author);
    }, 10 * 60 * 1000); // 10 minutes in milliseconds

  } catch (error) {
    console.error('Error fetching GitHub data:', error);
  }
};

// Listen for messages from the main thread
parentPort?.on('message', async (message) => {
  const {repoName, author} = message;
  await fetchGithubData(repoName, author);
});
