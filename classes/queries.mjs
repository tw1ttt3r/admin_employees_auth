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
      this.#params = [ user, pass ];
      const { rows } = await this.client.execute({
        sql: this.#query,
        args: [ ...this.#params ]
      });

      if (!rows[0].EXIST) {
        return { status: STATUSRESPONSE.NOTEXIST }
      }

      const roles = await this.#utils.fetch(`${ROLES_SERVICE}/getroles`, { user, key_validator: VALUE_PROTECTED_VERIFY } ,'POST');

      if (!roles) {
        throw Error('Roles Not Found!');
      }

      const auth = new Auth();
      const token = auth.create(user, roles);

      return { data: { token, roles }, status: STATUSRESPONSE.SUCCESS }

    } catch(e) {
      this.catch(this.login.name, e, this.#query, this.#params);
    } finally {
      this.disconnect();
      this.finally(this.login.name);
    }
  }

}

export {
  Queries
}