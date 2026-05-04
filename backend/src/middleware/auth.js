import { ApiError } from "../utils/errors.js";
import { verifyToken } from "../utils/jwt.js";

export function requireAuth(req, _res, next) {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return next(new ApiError(401, "Missing or invalid Authorization header"));
  }

  try {
    req.auth = verifyToken(token);
    return next();
  } catch {
    return next(new ApiError(401, "Invalid or expired token"));
  }
}

export function requireRole(...roles) {
  return (req, _res, next) => {
    if (!req.auth) return next(new ApiError(401, "Authentication required"));
    if (!roles.includes(req.auth.role)) {
      return next(new ApiError(403, "You do not have permission to perform this action"));
    }
    return next();
  };
}
