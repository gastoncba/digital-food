import mysql from 'mysql2';
import { config } from '../config/config';

export const pool = mysql
  .createPool({
    host: config.dbHost,
    database: config.dbName,
    user: config.dbUser,
    password: config.dbPassword,
  }).promise()
