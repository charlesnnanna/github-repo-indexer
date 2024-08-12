import db from '../config/database.js';
import { saveRepositoryData, saveCommits } from '../services/repository.js';

describe('Repository Service', () => {
  beforeAll(async () => {
    await db.migrate.latest();
  });

  afterAll(async () => {
    await db.destroy();
  });

  test('should save repository data', async () => {
    const repoName = 'chromium';
    const author = 'chromium'
    const repositoryId = await saveRepositoryData(repoName, author);

    const repository = await db('repositories').where({ id: repositoryId }).first();
    expect(repository.name).toBe(repoName);
  });

  test('should save commits', async () => {
    const repoName = 'chromium';
    const author = 'chromium'
    await saveCommits(repoName, author);

    const commits = await db('commits').where({ repository_id: 1 });
    expect(commits.length).toBeGreaterThan(0);
  });
});
