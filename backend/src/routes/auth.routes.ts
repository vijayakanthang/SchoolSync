import { Router } from 'express';

export const router = Router();

router.post('/login', (req, res) => {
  // TODO: implement JWT + Google OAuth login
  res.json({ message: 'Auth login endpoint placeholder' });
});

router.post('/register', (req, res) => {
  // TODO: implement registration
  res.json({ message: 'Auth register endpoint placeholder' });
});
