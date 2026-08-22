import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthenticatedRequest } from '../middleware/authenticate';

const router = Router();
const prisma = new PrismaClient();

// GET /api/community - Browse public itineraries
router.get('/', async (req: Request, res: Response) => {
  try {
    const { search, sortBy } = req.query;

    const where: any = {};

    if (search && typeof search === 'string') {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
      ];
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sortBy === 'likes') {
      orderBy = { likesCount: 'desc' };
    } else if (sortBy === 'clones') {
      orderBy = { clonesCount: 'desc' };
    }

    const posts = await prisma.communityPost.findMany({
      where,
      include: {
        author: {
          select: { id: true, name: true, profilePic: true, city: true, country: true },
        },
        trip: {
          include: {
            stops: {
              include: { city: true },
              orderBy: { stopOrder: 'asc' },
            },
          },
        },
      },
      orderBy,
    });

    return res.json(posts);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch community posts.' });
  }
});

// POST /api/community/share/:tripId - Publish trip to community
router.post('/share/:tripId', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { tripId } = req.params;
    const { title, description } = req.body;

    const trip = await prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip || (trip.userId !== req.user!.userId && req.user!.role !== 'ADMIN')) {
      return res.status(403).json({ message: 'Trip not found or unauthorized.' });
    }

    // Set trip isPublic = true
    await prisma.trip.update({
      where: { id: tripId },
      data: { isPublic: true },
    });

    // Create post or update existing
    const existingPost = await prisma.communityPost.findFirst({ where: { tripId } });
    if (existingPost) {
      const updated = await prisma.communityPost.update({
        where: { id: existingPost.id },
        data: {
          title: title || trip.title,
          description: description || trip.description,
        },
      });
      return res.json(updated);
    }

    const post = await prisma.communityPost.create({
      data: {
        tripId,
        authorId: req.user!.userId,
        title: title || trip.title,
        description: description || trip.description,
      },
    });

    return res.status(201).json(post);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to share trip to community.' });
  }
});

// POST /api/community/like/:id - Like post
router.post('/like/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const post = await prisma.communityPost.update({
      where: { id },
      data: { likesCount: { increment: 1 } },
    });
    return res.json(post);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to like post.' });
  }
});

export default router;
