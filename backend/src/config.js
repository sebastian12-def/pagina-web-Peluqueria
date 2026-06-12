import "dotenv/config";

export const config = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 4000),
  jwtSecret: process.env.JWT_SECRET || "dev-secret-change-me",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  frontendUrl: (process.env.FRONTEND_URL || "http://localhost:5173").split(",").map((url) => url.trim())
};

export function assertProductionConfig() {
  if (config.nodeEnv !== "production") return;

  if (!process.env.JWT_SECRET || config.jwtSecret.length < 32 || config.jwtSecret === "dev-secret-change-me") {
    throw new Error("JWT_SECRET debe ser fuerte y diferente al valor de desarrollo en produccion.");
  }
}
