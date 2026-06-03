import { Router } from 'express';
import jwt from 'jsonwebtoken';

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  // TODO: Replace with real DB lookup using Prisma
  // For now, accept any password and issue a demo token.
  const demoUser = {
    id: 'demo-admin',
    name: 'Demo Admin',
    email,
    role: 'ADMIN',
  };

  const token = jwt.sign(
    {
      sub: demoUser.id,
      email: demoUser.email,
      role: demoUser.role,
    },
    JWT_SECRET,
    { expiresIn: '2h' }
  );

  res.json({ user: demoUser, token });
});

router.get('/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Missing Authorization header' });
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    res.json({
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    });
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
});

export { router };
