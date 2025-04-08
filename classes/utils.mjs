class Utils {

  validateRequestBody(body, props) {
    if (!body) {
      return true;
    }

    let estatus = [];
    for (const p of props) {
      estatus = [ ...estatus, p in body ]
    }
    return !!estatus.includes(false)
  }

  async fetch(url, body, method, headers = {}) {
    try {
      const req = await fetch(url, { 
        method, 
        body: JSON.stringify(body), 
        headers: {
          "Content-Type": "application/json",
          ...headers
        }
      });
      return await req.json();
    } catch(e) {
      throw Error(`Error external Fetch: ${e}`);
    }
  }
}

export {
  Utils
}