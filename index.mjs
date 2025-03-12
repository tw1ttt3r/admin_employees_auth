import express from "express";
import { PORT, HOME } from "#config/index.mjs";

const app = express();

app.get(HOME, (req, res) => {
  res.send("Microservice Auth online!");
});

app.listen(PORT, () => {
  console.log(`Server it's alive!`);
});

// Exportar la app para que Vercel la reconozca
export default app;