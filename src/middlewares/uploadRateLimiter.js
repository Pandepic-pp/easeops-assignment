import rateLimit,  { ipKeyGenerator } from 'express-rate-limit';

const createUploadRateLimiter = () => {
  return rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: "Too many upload attempts. Try again later.",
    keyGenerator: ipKeyGenerator, 
    standardHeaders: true,
    legacyHeaders: false,
  });
};

export default createUploadRateLimiter;