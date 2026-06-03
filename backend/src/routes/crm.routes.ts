import { Router } from 'express';

export const router = Router();

router.get('/leads', (_req, res) => {
  // TODO: return list of leads from CRM service
  res.json({ data: [] });
});

router.post('/leads', (req, res) => {
  // TODO: create a new lead
  res.json({ message: 'Lead created placeholder' });
});
