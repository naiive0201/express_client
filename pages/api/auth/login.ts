import type { NextApiRequest, NextApiResponse } from 'next';
import { signIn } from 'next-auth/react';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { id, password } = req.body;
    console.log({ id, password });
    await signIn('credentials', { id, password });

    // res.status(200).json({ success: true });
  } catch (error) {
    if (error.type === 'CredentialsSignin') {
      res.status(401).json({ error: 'Invalid credentials.' });
    } else {
      res.status(500).json({ error: 'Something went wrong.' });
    }
  }
}
