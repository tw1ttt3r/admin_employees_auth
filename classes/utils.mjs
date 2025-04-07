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
}

export {
  Utils
}