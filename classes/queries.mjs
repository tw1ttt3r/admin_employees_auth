import { Database, Auth } from "#class/index.mjs";
import { STATUSRESPONSE } from "#config/index.mjs";

class Queries extends Database {

  #params = [];
  #query = '';

  constructor() {
    super();
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

      // TODO consumir roles_service para obtener roles del usuario

      const auth = new Auth();

      const token = auth.create(user);

      return { data: { token }, status: STATUSRESPONSE.SUCCESS }

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