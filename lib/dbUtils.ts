import { User } from '@/types';
import bcrypt from 'bcrypt';
import { prisma } from '@/init';

export async function getUser(
  username: string,
  password: string
): Promise<User | null> {
  const existUser = await prisma.users.findUniqueOrThrow({
    where: {
      username: username,
    },
  });

  const pwdVerified = await verifyPassword(existUser.password, password);

  if (!pwdVerified) {
    // password incorrect
    return null;
  }

  return existUser;
}

export async function createUser(
  username: string,
  password: string
): Promise<User> {
  await prisma.users.findUniqueOrThrow({
    where: {
      username: username,
    },
  });

  const hashedPassword = await bcrypt.hash(password, 10);

  const inserted = await prisma.users.create({
    data: {
      username: username,
      password: hashedPassword,
    },
  });

  return inserted;
}

async function verifyPassword(
  storedPassword: string,
  suppliedPassword: string
): Promise<boolean> {
  return bcrypt.compare(suppliedPassword, storedPassword);
}
