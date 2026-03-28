import { Role, User } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../../config/env";
import { prisma } from "../../config/prisma";

interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role?: Role;
}

interface LoginInput {
  email: string;
  password: string;
}

const sanitizeUser = (user: User) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt
});

const generateToken = (user: User): string => {
  return jwt.sign({ userId: user.id, role: user.role }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"]
  });
};

export const registerUser = async (input: RegisterInput) => {
  const existingUser = await prisma.user.findUnique({ where: { email: input.email } });
  if (existingUser) {
    throw new Error("Email already registered");
  }

  const passwordHash = await bcrypt.hash(input.password, 12);

  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      passwordHash,
      role: input.role ?? Role.USER
    }
  });

  const token = generateToken(user);
  return { user: sanitizeUser(user), token };
};

export const loginUser = async (input: LoginInput) => {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await bcrypt.compare(input.password, user.passwordHash);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = generateToken(user);
  return { user: sanitizeUser(user), token };
};
