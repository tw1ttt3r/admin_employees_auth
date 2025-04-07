import { createClient } from "@libsql/client";
import { DB_TOKEN, DB_URL } from "#config/vars.mjs";
import { Log } from "#class/log.mjs";
import { USUARIOS, TABLES } from "#db/index.mjs";


class Database extends Log {
  client = null;

  #queries = {
    isValidCredentials: `SELECT COUNT(${USUARIOS.ALL}) as EXIST FROM ${TABLES.usuarios} WHERE ${USUARIOS.USER}=? AND ${USUARIOS.PASS}=?`
  };

  constructor() {
    super();
  }

  connect() {
    this.client = createClient({
      url: `${DB_URL}`,
      authToken: `${DB_TOKEN}`
    });
  }

  disconnect() {
    this.client.close();
  }

  catch(origin, e, query = '', params = '') {
    this.error(`Opps! we got an error: ${origin}(${query}, [${params}]): ${e.message}`);
    throw new Error(`Opps! we got an error: ${origin}(${query}, ${params}): ${e.message}`);
  }

  finally(origin) {
    this.info(`Proceso Terminado: ${origin}`);
  }

  getQuery(query) {
    if (!(query in this.#queries)) {
      throw new Error(`Opps! this query: ${query} not exists!`);
    }
    return this.#queries[query];
  }
}

export {
  Database
}