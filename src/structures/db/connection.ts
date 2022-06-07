import mysql2 from "mysql2/promise";
import bluepird from 'bluebird'
import { tokens } from "../../tokens.js";

export const connection = await mysql2.createConnection({
  database: tokens.DB_name,
  password: tokens.DB_password,
  host: tokens.DB_HOST,
  user: tokens.DB_user,
  Promise: bluepird,
  multipleStatements: true
});
