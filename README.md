
# GitHub Data Indexer

The GitHub Data Indexer is a service that fetches repository data and commits from the GitHub API, stores the information in a database, and continuously monitors the repository for updates. The service is built with TypeScript, uses worker threads for background processing, and persists data using a relational database.


## Features

- Fetches repository metadata and commits from GitHub.
- Periodically checks for new commits every 10 minutes.
- Stores repository and commit data in a database.
- Handles edge cases such as rate limiting, null/missing data fields, and network issues with retries.
- Provides an API to retrieve commit data and top commit authors.
- Utilizes worker threads for efficient background processing.


## Getting Started

### Clone the Repository

```bash
git clone https://github.com/yourusername/github-data-indexer.git
cd github-data-indexer
```

### Install Dependencies
```bash
npm install
```

### Generate Migrations
```bash
knex migrate:make create_repositories_table
knex migrate:make create_commits_table
knex migrate:latest
```

### Running the Application Environment
```bash
npm run dev
```

### Building the Application Environment
```bash
npm run build
```

### Running the Compiled App
```bash
npm run start
```

### About the App
- In the app.ts, you can change the repository you want the app to monitor and track by changing the parameters of the startWorker function.
```bash
startWorker(repoName, author)
```
This can be further modified to make it dynamic. But in this app, it's static.

### Endpoints
- Get Top N Commit Authors by commit counts
```bash
GET /repository/:repositoryName/top-authors?limit=N
```
N is the number of top authors you want to get.

- Get commits of a repository by repository name from database
```bash
GET /repository/:repositoryName/commits
```
The repositoryName must be the repoName specified in the startWorker function.
I know the idea would be to make it dynamic, but this is just the basic level of the app from where we can see what is possible.