import express from "express";
import helmet from "helmet";
import cors from "cors";
import { OPTIONS } from "#config/whitelist.mjs";
import { PORT, ROUTES, STATUSHTTP, EXCLUDED_ROUTES } from "#config/index.mjs";
import { Utils } from "#class/utils.mjs";
import { Queries } from "#class/index.mjs";
// exponemos crypto globalmente
import { webcrypto } from 'crypto'
globalThis.crypto = webcrypto

const app = express();
app.use(express.json());
app.use(helmet());
app.use((req, res, next) => {
  const noCorsRoutes = [...EXCLUDED_ROUTES.split(',')]; // Rutas excluidas de CORS

  if (noCorsRoutes.includes(req.path)) {
    return next();
  }

  cors(OPTIONS)(req, res, next);
});
const utils = new Utils();

app.get(ROUTES.HOME, (_, res) => {
  res.json({ response: "Microservice Auth online!" }).send();
});

app.post(ROUTES.LOGIN, async (req, res) => {
  try {
    if (utils.validateRequestBody(req.body, ['user','pass'])) {
      res.status(STATUSHTTP.BADREQUEST).json({ msg: "Credential missings" }).send();
      return
    }
    const conn = new Queries(utils);
    const r = await conn.login({ ...req.body });
  
    res.json({ ...r }).send();
  } catch(error) {
    res.status(STATUSHTTP.BADREQUEST).json({ data: 'Token no generado' }).send();
  }
});

// /* WILDCARD */
app.use((_, res) => {
  res.status(STATUSHTTP.NOTIMPLEMENTED).json({ response: '...' }).send();
});

app.listen(PORT, () => {
  console.log(`Server it's alive!`);
});

// Exportar la app para que Vercel la reconozca
export default app;