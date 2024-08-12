
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