import { Database, Auth } from "#class/index.mjs";
import { STATUSRESPONSE, ROLES_SERVICE, VALUE_PROTECTED_VERIFY } from "#config/index.mjs";

class Queries extends Database {

  #params = [];
  #query = '';
  #utils = null;

  constructor(utils) {
    super();
    this.#utils = utils;
  }

  async login({ user, pass }) {
    try {
      this.connect();
      this.#query = this.getQuery('isValidCredentials');
      this.#params = [ user ];
      const { rows: exists } = await this.client.execute({
        sql: this.#query,
        args: [ ...this.#params ]
      });

      if (!exists[0].EXIST) {
        return { status: STATUSRESPONSE.NOTEXIST }
      }

      this.#query = this.getQuery('getHashPass');
      this.#params = [ user ];
      const { rows: passwords } = await this.client.execute({
        sql: this.#query,
        args: [ ...this.#params ]
      });

      if (!passwords.length) {
        return { status: STATUSRESPONSE.NOTEXIST }
      }
      
      const auth = new Auth();

      if (!auth.comparePass(pass, passwords[0].PASSWORD)) {
        return { status: STATUSRESPONSE.NOTEXIST }
      }

      const roles = await this.#utils.fetch(`${ROLES_SERVICE}/getroles`, { user, key_validator: VALUE_PROTECTED_VERIFY } ,'POST');

      if (roles.data.status !== 1) {
        throw Error('Roles Not Found!');
      }

      const token = auth.create(user, roles);

      return { data: { token, roles }, status: STATUSRESPONSE.SUCCESS }

    } catch(e) {
      this.catch(this.login.name, e, this.#query, this.#params);
    } finally {
      this.disconnect();
      this.finally(this.login.name);
    }
  }

  async registerUser({ user, pass, nombre, ap_paterno, ap_materno, correo, telefono }) {
    let tx = null;
    try {
      this.connect();
      tx = await this.client.transaction();
      this.#query = this.getQuery('registerUser');
      const auth = new Auth();
      const passHash = await auth.createPassHash(pass);
      this.#params = [ user, passHash ];
      const { lastInsertRowid: userid } = await tx.execute({
        sql: this.#query,
        args: [ ...this.#params ]
      });
      this.#query = this.getQuery('registerUserData');
      this.#params = [ userid, nombre, ap_paterno, ap_materno, correo, telefono];
      await tx.execute({
        sql: this.#query,
        args: [ ...this.#params ]
      });

      await tx.commit();
      return { data: { status: 1 }, status: STATUSRESPONSE.SUCCESS }
    } catch(e) {
      await tx.rollback();
      this.catch(this.registerUser.name, e, this.#query, this.#params);
    } finally {
      this.disconnect();
      this.finally(this.registerUser.name);
    }
  }

  async changePass({ user, pass, newpass }) {
    try {
      this.connect();
      this.#query = this.getQuery('isValidCredentials');
      this.#params = [ user, pass ];
      const { rows: exists } = await this.client.execute({
        sql: this.#query,
        args: [ ...this.#params ]
      });

      if (!exists[0].EXIST) {
        return { status: STATUSRESPONSE.NOTEXIST }
      }

      this.#query = this.getQuery('getHashPass');
      this.#params = [ user ];
      const { rows: passwords } = await this.client.execute({
        sql: this.#query,
        args: [ ...this.#params ]
      });

      if (!passwords.length) {
        return { status: STATUSRESPONSE.NOTEXIST }
      }

      const auth = new Auth();
      const passHash = await auth.createPassHash(newpass);

      this.#query = this.getQuery('updatePass');
      this.#params = [ user, passHash ];
      await this.client.execute({
        sql: this.#query,
        args: [ ...this.#params ]
      });

      return { data: { status: 1 }, status: STATUSRESPONSE.SUCCESS }

    } catch(e) {
      this.catch(this.changePass.name, e, this.#query, this.#params);
    } finally {
      this.disconnect();
      this.finally(this.changePass.name);
    }
  }

  async changestatus({ user, status }) {
    try {
      this.connect();
      this.#query = this.getQuery('updateStatusUser');
      this.#params = [ user, status ];
      await this.client.execute({
        sql: this.#query,
        args: [ ...this.#params ]
      });

      return { data: { status: 1 }, status: STATUSRESPONSE.SUCCESS }

    } catch(e) {
      this.catch(this.changePass.name, e, this.#query, this.#params);
    } finally {
      this.disconnect();
      this.finally(this.changestatus.name);
    }
  }
}

export {
  Queries
}