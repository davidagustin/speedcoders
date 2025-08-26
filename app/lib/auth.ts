import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function generateToken(userId: string): string {
  return jwt.sign({ userId }, process.env.NEXTAUTH_SECRET!, { expiresIn: '24h' });
}