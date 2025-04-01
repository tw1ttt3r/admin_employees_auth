import express from "express";
import helmet from "helmet";
import cors from "cors";
import { OPTIONS } from "#config/whitelist.mjs";
import { PORT, ROUTES, STATUSHTTP } from "#config/index.mjs";

const app = express();
app.use(express.json());
app.use(helmet());
app.use(cors(OPTIONS));

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