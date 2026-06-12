import "dotenv/config";

export const config = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 4000),
  jwtSecret: process.env.JWT_SECRET || "dev-secret-change-me",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  frontendUrl: (process.env.FRONTEND_URL || "http://localhost:5173,http://localhost:5174").split(",").map((url) => url.trim())
};

export function assertProductionConfig() {
  if (config.nodeEnv !== "production") return;

  if (!process.env.JWT_SECRET || config.jwtSecret.length < 32 || config.jwtSecret === "dev-secret-change-me") {
    throw new Error("JWT_SECRET debe ser fuerte y diferente al valor de desarrollo en produccion.");
  }
}

export function isOriginAllowed(origin) {
  if (!origin) return true;
  if (config.frontendUrl.includes(origin)) return true;
  if (config.nodeEnv === "production") return false;

  return /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\]|192\.168\.\d{1,3}\.\d{1,3}|10\.\d{1,3}\.\d{1,3}\.\d{1,3}|172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3})(:\d+)?$/.test(origin);
}
