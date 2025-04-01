import { WHITELIST } from "#config/vars.mjs";

const WHITELISTDOMAINS = [ ...WHITELIST.split(",") ];

const OPTIONS = {
  origin: (origin, callback) => {
    return (!!origin && WHITELISTDOMAINS.indexOf(origin) !== -1)
      ? callback(null, true)
      : callback((`Not allowed`), false)
  }
}

export { OPTIONS };