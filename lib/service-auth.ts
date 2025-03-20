import jwt from "jsonwebtoken";

const SERVICE_JWT_SECRET = process.env.SERVICE_JWT_SECRET;

export function createServiceToken(payload: {
  videoId: string;
  userId: string;
}) {
  if (!SERVICE_JWT_SECRET) {
    throw new Error("ENV SERVICE_JWT_SECRET is required.");
  }

  return jwt.sign(payload, SERVICE_JWT_SECRET, { expiresIn: "15m" });
}
