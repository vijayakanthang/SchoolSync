import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const router = Router();

// Simple auth middleware to extract user id from JWT for demo
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

router.use((req, _res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return next();
  const token = authHeader.replace('Bearer ', '');
  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    // attach demo user info to request
    (req as any).user = { id: payload.sub, email: payload.email, role: payload.role };
  } catch {
    // ignore invalid tokens in this demo; protected routes will still check
  }
  next();
});

// GET /api/crm/leads?stage=&page=&limit=
router.get('/leads', async (req, res) => {
  const { stage, page = '1', limit = '10' } = req.query as Record<string, string>;
  const pageNum = parseInt(page, 10) || 1;
  const take = parseInt(limit, 10) || 10;
  const skip = (pageNum - 1) * take;

  const where: any = {};
  if (stage) {
    where.stage = stage;
  }

  try {
    const [items, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      prisma.lead.count({ where }),
    ]);

    res.json({
      items,
      total,
      page: pageNum,
      limit: take,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch leads' });
  }
});

// POST /api/crm/leads
router.post('/leads', async (req, res) => {
  const { name, contactEmail, contactPhone, source } = req.body;
  if (!name || !contactEmail || !contactPhone) {
    return res.status(400).json({ message: 'name, contactEmail and contactPhone are required' });
  }

  const user = (req as any).user || { id: 'demo-admin' };

  try {
    const lead = await prisma.lead.create({
      data: {
        name,
        contactEmail,
        contactPhone,
        source,
        createdById: user.id,
      },
    });

    // Log an activity for the new lead
    await prisma.activity.create({
      data: {
        title: 'New lead created',
        description: `Lead ${name} created with email ${contactEmail}`,
        type: 'NOTE',
        createdById: user.id,
      },
    });

    res.status(201).json(lead);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create lead' });
  }
});

// PATCH /api/crm/leads/:id - update stage
router.patch('/leads/:id', async (req, res) => {
  const { id } = req.params;
  const { stage } = req.body;

  if (!stage) {
    return res.status(400).json({ message: 'stage is required' });
  }

  const user = (req as any).user || { id: 'demo-admin' };

  try {
    const lead = await prisma.lead.update({
      where: { id },
      data: { stage },
    });

    await prisma.activity.create({
      data: {
        title: 'Lead stage updated',
        description: `Lead ${lead.name} moved to stage ${stage}`,
        type: 'NOTE',
        createdById: user.id,
      },
    });

    res.json(lead);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update lead' });
  }
});

// GET /api/crm/activities?limit=
router.get('/activities', async (req, res) => {
  const { limit = '20' } = req.query as Record<string, string>;
  const take = parseInt(limit, 10) || 20;

  try {
    const activities = await prisma.activity.findMany({
      orderBy: { createdAt: 'desc' },
      take,
    });
    res.json(activities);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch activities' });
  }
});

export { router };
