const { saveRepositoryData, saveCommits } = require('../services/repository');

const monitorRepository = async () => {
  const repoName = process.env.REPOSITORY_NAME || 'chromium';

  try {
    await saveRepositoryData(repoName);
    await saveCommits(repoName);
    console.log(`Successfully fetched and saved data for repository: ${repoName}`);
  } catch (error:any) {
    console.error(`Error during repository monitoring: ${error.message}`);
  }
};

// Run every 10 minutes
setInterval(monitorRepository, 10 * 60 * 1000);
