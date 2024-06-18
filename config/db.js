import pkg from "pg";
const { Pool } = pkg;
process.loadEnvFile();

const { DB_PASSWORD, DB_USER, DB_DATABASE, DB_HOST } = process.env;

const config = {
  host: DB_HOST,
  database: DB_DATABASE,
  user: DB_USER,
  password: DB_PASSWORD,
  allowExitOnIdle: true,
};

const db = new Pool(config);

export default db;