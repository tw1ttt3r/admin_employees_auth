import express from "express";
import helmet from "helmet";
import cors from "cors";
import { OPTIONS } from "#config/whitelist.mjs";
import { PORT, ROUTES, STATUSHTTP, EXCLUDED_ROUTES } from "#config/index.mjs";

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

app.get(ROUTES.HOME, (_, res) => {
  res.json({ response: "Microservice Auth online!" }).send();
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