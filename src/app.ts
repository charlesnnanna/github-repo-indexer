import express from 'express';
import routes from './routes/index.js';
import { Worker } from 'worker_threads';
import path from 'path';

const app = express();

app.use(express.json());
app.use('/api', routes);


// Function to start the worker thread
const startWorker = (repoName: string, author: string) => {
  const worker = new Worker(path.resolve(__dirname, 'workers/fetchGithubData.js'));

  // Send the repository name to the worker
  worker.postMessage({repoName, author});

  worker.on('error', (err) => {
    console.error('Worker error:', err);
  });

  worker.on('exit', (code) => {
    if (code !== 0) {
      console.error(`Worker stopped with exit code ${code}`);
    }
  });
};

// Start the worker with the default repository
// To change the repository the app will fetch 
// You can change the repoName and the author respectively
startWorker('chromium', 'chromium');

export default app;
