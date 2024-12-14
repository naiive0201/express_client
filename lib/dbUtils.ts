import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { User } from '@/types';
import bcrypt from 'bcrypt';

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
  const db = await openDb();
  const existUser = await db.get<User>(
    'SELECT * FROM users WHERE username = ?',
    username
  );

  await db.close();

  if (!existUser) {
    // user not found
    return null;
  }

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
  const db = await openDb();

  const existUser = await db.get<User>(
    'SELECT * FROM users WHERE username = ?',
    username
  );

  if (existUser) {
    // user already exists
    throw new Error('User Exists');
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  await db.run(
    'INSERT INTO users (username, password) VALUES (?, ?)',
    username,
    hashedPassword
  );

  const user = await db.get('SELECT * FROM users WHERE username = ?', username);

  await db.close();

  return user;
}

async function verifyPassword(
  storedPassword: string,
  suppliedPassword: string
): Promise<boolean> {
  return bcrypt.compare(suppliedPassword, storedPassword);
}
