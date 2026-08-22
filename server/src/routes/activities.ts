import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthenticatedRequest } from '../middleware/authenticate';
import { requireAdmin } from '../middleware/rbac';

const router = Router();
const prisma = new PrismaClient();

// GET /api/activities - Search & filter activities across cities
router.get('/', async (req: Request, res: Response) => {
  try {
    const { cityId, category, search, maxCost } = req.query;

    const where: any = {};

    if (cityId && typeof cityId === 'string') {
      where.cityId = cityId;
    }

    if (category && typeof category === 'string' && category !== 'ALL') {
      where.category = category;
    }

    if (maxCost && typeof maxCost === 'string') {
      where.estimatedCost = { lte: parseFloat(maxCost) };
    }

    if (search && typeof search === 'string') {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
      ];
    }

    const activities = await prisma.activity.findMany({
      where,
      include: {
        city: true,
      },
      orderBy: { title: 'asc' },
    });

    return res.json(activities);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch activities.' });
  }
});

// POST /api/activities - Create activity (Admin only)
router.post('/', authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { cityId, title, description, category, estimatedCost, durationHours, imageUrl } = req.body;

    const activity = await prisma.activity.create({
      data: {
        cityId,
        title,
        description,
        category,
        estimatedCost: estimatedCost ? parseFloat(estimatedCost) : 0,
        durationHours: durationHours ? parseFloat(durationHours) : 2.0,
        imageUrl,
      },
      include: { city: true },
    });

    return res.status(201).json(activity);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to create activity.' });
  }
});

export default router;
