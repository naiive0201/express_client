import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { User } from '@/types';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function openDb() {
  return open({
    filename: 'mydb.db',
    driver: sqlite3.Database,
  });
}

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
  // const db = await openDb();

  await prisma.users.findUniqueOrThrow({
    where: {
      username: username,
    },
  });

  // const existUser = await db.get<User>(
  //   'SELECT * FROM users WHERE username = ?',
  //   username
  // );

  // if (existUser) {
  //   // user already exists
  //   throw new Error('User Exists');
  // }
  const hashedPassword = await bcrypt.hash(password, 10);

  const inserted = await prisma.users.create({
    data: {
      username: username,
      password: hashedPassword,
    },
  });

  // const user = await db.get('SELECT * FROM users WHERE username = ?', username);

  // await db.close();

  return inserted;
}

async function verifyPassword(
  storedPassword: string,
  suppliedPassword: string
): Promise<boolean> {
  return bcrypt.compare(suppliedPassword, storedPassword);
}
