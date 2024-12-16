import type { NextApiRequest, NextApiResponse } from 'next';
import { createToken } from '@/lib/jwtUtils';
import { getUser } from '@/lib/dbUtils';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return res;
  }

  const { username, password } = req.body;

  const userExist = await getUser(username, password);
  if (userExist) {
    const token = await createToken({ username: username });
    res.status(200).json({ token });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
}
