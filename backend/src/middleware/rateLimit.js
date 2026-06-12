export function rateLimit({ windowMs = 60_000, max = 20, message = "Demasiados intentos. Intenta nuevamente mas tarde." } = {}) {
  const hits = new Map();

  return (req, res, next) => {
    const key = `${req.ip}:${req.originalUrl}`;
    const now = Date.now();
    const current = hits.get(key);

    if (!current || current.resetAt <= now) {
      hits.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }

    current.count += 1;
    if (current.count > max) {
      return res.status(429).json({ message });
    }

    return next();
  };
}
