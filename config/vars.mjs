import { config } from "dotenv";

config();

const {
  PORT,
  DB_URL,
  DB_TOKEN,
  WHITELIST
} = process.env;

export {
  PORT,
  DB_URL,
  DB_TOKEN,
  WHITELIST
};