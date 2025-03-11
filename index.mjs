import express from "express";
import { PORT } from "./config/vars.mjs";

const app = express();

app.get("/", (req, res) => {
  res.send("Hello, Express 5 with Bun!");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

// Exportar la app para que Vercel la reconozca
export default app;