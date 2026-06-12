import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { ZodError } from "zod";
import { assertProductionConfig, config, isOriginAllowed } from "./config.js";
import { adminRouter } from "./routes/adminRoutes.js";
import { authRouter } from "./routes/authRoutes.js";
import { clientRouter } from "./routes/clientRoutes.js";
import { publicRouter } from "./routes/publicRoutes.js";

const app = express();

assertProductionConfig();
app.use(helmet());
app.use(cors({
  origin(origin, callback) {
    if (isOriginAllowed(origin)) return callback(null, true);
    return callback(null, false);
  },
  credentials: true
}));
app.use(express.json({ limit: "100kb" }));
app.use(morgan("dev"));

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/auth", authRouter);
app.use("/api/public", publicRouter);
app.use("/api/client", clientRouter);
app.use("/api/admin", adminRouter);

app.use((error, _req, res, _next) => {
  if (error instanceof ZodError) {
    return res.status(400).json({ message: "Datos invalidos.", issues: error.issues });
  }

  if (error.code === "P2025") {
    return res.status(404).json({ message: "Registro no encontrado." });
  }

  const status = error.status || 500;
  return res.status(status).json({ message: error.message || "Error interno." });
});

app.listen(config.port, () => {
  console.log(`API lista en http://localhost:${config.port}`);
});
