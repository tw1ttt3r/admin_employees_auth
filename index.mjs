import express from "express";
import helmet from "helmet";
import cors from "cors";
import { OPTIONS } from "#config/whitelist.mjs";
import { PORT, ROUTES, STATUSHTTP, EXCLUDED_ROUTES } from "#config/index.mjs";
import { Utils } from "#class/utils.mjs";
import { Queries } from "#class/index.mjs";

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

app.post(ROUTES.REGISTER, async(req, res) => {
  try {
    if (utils.validateRequestBody(req.body, ['user','pass','nombre','ap_paterno','ap_materno','correo','telefono'])) {
      res.status(STATUSHTTP.BADREQUEST).json({ msg: "Data missings" }).send();
      return
    }
    const conn = new Queries(utils);
    const r = await conn.registerUser({ ...req.body });
  
    res.json({ ...r }).send();

  } catch(error) {
    res.status(STATUSHTTP.BADREQUEST).json({ data: 'Registro no exitoso' }).send();
  }
});

app.post(ROUTES.CHANGEPASS, async(req, res) => {
  try {
    if (utils.validateRequestBody(req.body, ['user','pass','newpass'])) {
      res.status(STATUSHTTP.BADREQUEST).json({ msg: "Data missings" }).send();
      return
    }
    const conn = new Queries(utils);
    const r = await conn.registerUser({ ...req.body });
  
    res.json({ ...r }).send();

  } catch(error) {
    res.status(STATUSHTTP.BADREQUEST).json({ data: 'Registro no exitoso' }).send();
  }
});

app.put(ROUTES.CHANGESTATUSDISABLED, async(req, res) => {
  try {
    if (utils.validateRequestBody(req.body, ['user'])) {
      res.status(STATUSHTTP.BADREQUEST).json({ msg: "Data missings" }).send();
      return
    }
    const conn = new Queries(utils);
    const r = await conn.changestatus({ ...req.body, status: 0 });
  
    res.json({ ...r }).send();

  } catch(error) {
    res.status(STATUSHTTP.BADREQUEST).json({ data: 'Registro no exitoso' }).send();
  }
});

app.put(ROUTES.CHANGESTATUSENABLED, async(req, res) => {
  try {
    if (utils.validateRequestBody(req.body, ['user'])) {
      res.status(STATUSHTTP.BADREQUEST).json({ msg: "Data missings" }).send();
      return
    }
    const conn = new Queries(utils);
    const r = await conn.changestatus({ ...req.body, status: 1 });
  
    res.json({ ...r }).send();

  } catch(error) {
    res.status(STATUSHTTP.BADREQUEST).json({ data: 'Registro no exitoso' }).send();
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