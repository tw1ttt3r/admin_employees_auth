import { config } from "dotenv";

config();

const {
  PORT,
  DB_URL,
  DB_TOKEN,
  WHITELIST,
  EXCLUDED_ROUTES,
  TOKEN_KEY_SIGN,
  VALUE_PROTECTED_VERIFY,
  ROLES_SERVICE,
  SALTROUNDS,
  CORS
} = process.env;

export {
  PORT,
  DB_URL,
  DB_TOKEN,
  WHITELIST,
  EXCLUDED_ROUTES,
  TOKEN_KEY_SIGN,
  VALUE_PROTECTED_VERIFY,
  ROLES_SERVICE,
  SALTROUNDS,
  CORS
};