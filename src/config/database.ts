import knex from 'knex';
import path from 'path';

const configPath = path.join(__dirname, '../../knexfile.js');
const db = knex(require(configPath));

export default db;
