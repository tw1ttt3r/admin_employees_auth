import { createClient } from "@libsql/client";
import { DB_TOKEN, DB_URL } from "#config/vars.mjs";
import { Log } from "#class/log.mjs";
import { USUARIOS, TABLES, DATOSPERSONALES } from "#db/index.mjs";


class Database extends Log {
  client = null;

  #queries = {
    isValidCredentials: `SELECT COUNT(${USUARIOS.ALL}) as EXIST FROM ${TABLES.usuarios} WHERE ${USUARIOS.USER}= ?`,
    registerUser: `INSERT INTO ${TABLES.usuarios}(${USUARIOS.USER},${USUARIOS.PASS},${USUARIOS.ESTATUS}) VALUES(?,?,1)`,
    registerUserData: `INSERT INTO ${TABLES.datos_personales}(${DATOSPERSONALES.IDUSUARIO},${DATOSPERSONALES.NOMBRE},${DATOSPERSONALES.APPATERNO},${DATOSPERSONALES.APMATERNO},${DATOSPERSONALES.CORREO},${DATOSPERSONALES.TELEFONO},${DATOSPERSONALES.ALTA}) VALUES(?,?,?,?,?,?,1)`,
    getHashPass: `SELECT ${USUARIOS.PASS} PASSWORD FROM ${TABLES.usuarios} WHERE ${USUARIOS.USER} = ?`,
    updatePass: `UPDATE ${TABLES.usuarios} SET ${USUARIOS.PASS} = ? WHERE ${USUARIOS.USER} = ?`,
    updateStatusUser: `UPDATE ${TABLES.usuarios} SET ${USUARIOS.ESTATUS} = ? WHERE ${USUARIOS.USER} = ?`
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