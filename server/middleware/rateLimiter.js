const loginAttempts = new Map();

// Max 10 attempts per 15 minutes per IP
export function loginRateLimiter(req, res, next) {
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  const now = Date.now();
  const windowMs = 15 * 60 * 1000;
  const maxAttempts = 10;

  const record = loginAttempts.get(ip);

  if (!record) {
    loginAttempts.set(ip, { count: 1, firstAttempt: now });
    return next();
  }

  if (now - record.firstAttempt > windowMs) {
    loginAttempts.set(ip, { count: 1, firstAttempt: now });
    return next();
  }

  if (record.count >= maxAttempts) {
    const timeLeft = Math.ceil((windowMs - (now - record.firstAttempt)) / 60000);
    return res.status(429).json({
      success: false,
      message: `Too many login attempts. Please wait ${timeLeft} minutes before trying again.`
    });
  }

  record.count += 1;
  next();
}

export function resetLoginAttempts(ip) {
  if (ip) loginAttempts.delete(ip);
}
