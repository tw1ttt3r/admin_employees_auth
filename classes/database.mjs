import { createClient } from "@libsql/client";
import { DBTOKEN, DATABASE } from "#config/vars.mjs";


class Database {
  client = null;

  connect() {
    this.client = createClient({
      url: `${DATABASE}`,
      authToken: `${DBTOKEN}`
    });
  }

  disconnect() {
    this.client.close();
  }
}

export {
  Database
}