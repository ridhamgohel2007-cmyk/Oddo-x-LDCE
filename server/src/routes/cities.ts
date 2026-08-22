import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthenticatedRequest } from '../middleware/authenticate';
import { requireAdmin } from '../middleware/rbac';

const router = Router();
const prisma = new PrismaClient();

// GET /api/cities - List all cities
router.get('/', async (req: Request, res: Response) => {
  try {
    const { search, region, costIndex, popular } = req.query;

    const where: any = {};

    if (search && typeof search === 'string') {
      where.OR = [
        { name: { contains: search } },
        { country: { contains: search } },
        { region: { contains: search } },
      ];
    }

    if (region && typeof region === 'string' && region !== 'ALL') {
      where.region = region;
    }

    if (costIndex && typeof costIndex === 'string' && costIndex !== 'ALL') {
      where.costIndex = costIndex;
    }

    const orderBy: any = popular === 'true' ? { popularityScore: 'desc' } : { name: 'asc' };

    const cities = await prisma.city.findMany({
      where,
      include: {
        activities: true,
      },
      orderBy,
    });

    return res.json(cities);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch cities.' });
  }
});

// GET /api/cities/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const city = await prisma.city.findUnique({
      where: { id },
      include: { activities: true },
    });

    if (!city) {
      return res.status(404).json({ message: 'City not found.' });
    }

    return res.json(city);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch city.' });
  }
});

// POST /api/cities - Create city (Admin only)
router.post('/', authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, country, region, imageUrl, description, costIndex, popularityScore } = req.body;

    const city = await prisma.city.create({
      data: {
        name,
        country,
        region,
        imageUrl,
        description,
        costIndex: costIndex || 'MEDIUM',
        popularityScore: popularityScore ? parseInt(popularityScore) : 80,
      },
    });

    return res.status(201).json(city);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to create city.' });
  }
});

export default router;
