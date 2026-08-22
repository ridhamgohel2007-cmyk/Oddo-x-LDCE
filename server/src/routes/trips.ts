import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthenticatedRequest } from '../middleware/authenticate';

const router = Router();
const prisma = new PrismaClient();

// GET /api/trips - List user's trips
router.get('/', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { status, search, limit } = req.query;
    const userId = req.user!.userId;

    const where: any = { userId };

    if (status && typeof status === 'string' && status !== 'ALL') {
      where.status = status;
    }

    if (search && typeof search === 'string') {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
      ];
    }

    const trips = await prisma.trip.findMany({
      where,
      include: {
        stops: {
          include: {
            city: true,
            items: true,
          },
          orderBy: { stopOrder: 'asc' },
        },
        expenses: true,
      },
      orderBy: { startDate: 'asc' },
      take: limit ? parseInt(limit as string) : undefined,
    });

    return res.json(trips);
  } catch (error) {
    console.error('Error fetching trips:', error);
    return res.status(500).json({ message: 'Failed to fetch trips.' });
  }
});

// GET /api/trips/:id - Get single trip details
router.get('/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const trip = await prisma.trip.findUnique({
      where: { id },
      include: {
        stops: {
          include: {
            city: true,
            items: {
              include: {
                activity: true,
              },
              orderBy: [{ dayNumber: 'asc' }, { itemOrder: 'asc' }],
            },
          },
          orderBy: { stopOrder: 'asc' },
        },
        expenses: {
          orderBy: { date: 'desc' },
        },
        user: {
          select: { id: true, name: true, email: true, profilePic: true },
        },
      },
    });

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found.' });
    }

    if (trip.userId !== req.user!.userId && !trip.isPublic && req.user!.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Access denied.' });
    }

    return res.json(trip);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch trip details.' });
  }
});

// POST /api/trips - Create new trip
router.post('/', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { title, description, coverImage, startDate, endDate, totalBudget, isPublic, cityId } = req.body;

    if (!title || !startDate || !endDate) {
      return res.status(400).json({ message: 'Title, start date, and end date are required.' });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();

    let status = 'UPCOMING';
    if (now >= start && now <= end) {
      status = 'ONGOING';
    } else if (now > end) {
      status = 'COMPLETED';
    }

    const trip = await prisma.trip.create({
      data: {
        userId: req.user!.userId,
        title,
        description,
        coverImage: coverImage || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1000&q=80',
        startDate: start,
        endDate: end,
        status,
        isPublic: Boolean(isPublic),
        totalBudget: totalBudget ? parseFloat(totalBudget) : 0,
      },
    });

    if (cityId) {
      const city = await prisma.city.findUnique({ where: { id: cityId } });
      await prisma.tripStop.create({
        data: {
          tripId: trip.id,
          cityId,
          title: `Stop 1: ${city ? city.name : 'Primary Destination'}`,
          stopOrder: 1,
          startDate: start,
          endDate: end,
          budget: totalBudget ? parseFloat(totalBudget) : 0,
        },
      });
    }

    const fullTrip = await prisma.trip.findUnique({
      where: { id: trip.id },
      include: {
        stops: { include: { city: true, items: true } },
        expenses: true,
      },
    });

    return res.status(201).json(fullTrip);
  } catch (error) {
    console.error('Error creating trip:', error);
    return res.status(500).json({ message: 'Failed to create trip.' });
  }
});

// PUT /api/trips/:id - Update trip details
router.put('/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, coverImage, startDate, endDate, status, isPublic, totalBudget } = req.body;

    const existing = await prisma.trip.findUnique({ where: { id } });
    if (!existing || (existing.userId !== req.user!.userId && req.user!.role !== 'ADMIN')) {
      return res.status(403).json({ message: 'Trip not found or unauthorized.' });
    }

    const updated = await prisma.trip.update({
      where: { id },
      data: {
        title,
        description,
        coverImage,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        status,
        isPublic: isPublic !== undefined ? Boolean(isPublic) : undefined,
        totalBudget: totalBudget !== undefined ? parseFloat(totalBudget) : undefined,
      },
      include: {
        stops: { include: { city: true, items: true } },
        expenses: true,
      },
    });

    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update trip.' });
  }
});

// DELETE /api/trips/:id
router.delete('/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const existing = await prisma.trip.findUnique({ where: { id } });

    if (!existing || (existing.userId !== req.user!.userId && req.user!.role !== 'ADMIN')) {
      return res.status(403).json({ message: 'Trip not found or unauthorized.' });
    }

    await prisma.trip.delete({ where: { id } });
    return res.json({ message: 'Trip deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete trip.' });
  }
});

// POST /api/trips/:id/stops - Add Stop
router.post('/:id/stops', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { cityId, title, startDate, endDate, budget, stopOrder } = req.body;

    const trip = await prisma.trip.findUnique({ where: { id } });
    if (!trip || (trip.userId !== req.user!.userId && req.user!.role !== 'ADMIN')) {
      return res.status(403).json({ message: 'Trip not found or unauthorized.' });
    }

    const stop = await prisma.tripStop.create({
      data: {
        tripId: id,
        cityId,
        title: title || 'New Travel Stop',
        stopOrder: stopOrder || 1,
        startDate: startDate ? new Date(startDate) : trip.startDate,
        endDate: endDate ? new Date(endDate) : trip.endDate,
        budget: budget ? parseFloat(budget) : 0,
      },
      include: {
        city: true,
        items: true,
      },
    });

    return res.status(201).json(stop);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to add stop.' });
  }
});

// POST /api/trips/stops/:stopId/items - Add Itinerary Item
router.post('/stops/:stopId/items', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { stopId } = req.params;
    const { activityId, title, dayNumber, timeSlot, cost, type, itemOrder } = req.body;

    const stop = await prisma.tripStop.findUnique({
      where: { id: stopId },
      include: { trip: true },
    });

    if (!stop || (stop.trip.userId !== req.user!.userId && req.user!.role !== 'ADMIN')) {
      return res.status(403).json({ message: 'Stop not found or unauthorized.' });
    }

    const item = await prisma.itineraryItem.create({
      data: {
        stopId,
        activityId,
        title: title || 'Activity Item',
        dayNumber: dayNumber ? parseInt(dayNumber) : 1,
        timeSlot,
        cost: cost ? parseFloat(cost) : 0,
        type: type || 'ACTIVITY',
        itemOrder: itemOrder || 1,
      },
      include: { activity: true },
    });

    return res.status(201).json(item);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to add itinerary item.' });
  }
});

// DELETE /api/trips/items/:itemId - Remove Itinerary Item
router.delete('/items/:itemId', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { itemId } = req.params;
    const item = await prisma.itineraryItem.findUnique({
      where: { id: itemId },
      include: { stop: { include: { trip: true } } },
    });

    if (!item || (item.stop.trip.userId !== req.user!.userId && req.user!.role !== 'ADMIN')) {
      return res.status(403).json({ message: 'Item not found or unauthorized.' });
    }

    await prisma.itineraryItem.delete({ where: { id: itemId } });
    return res.json({ message: 'Item deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete item.' });
  }
});

// POST /api/trips/:id/clone - Clone / Copy Public Trip
router.post('/:id/clone', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const originalTrip = await prisma.trip.findUnique({
      where: { id },
      include: {
        stops: {
          include: { items: true },
        },
      },
    });

    if (!originalTrip) {
      return res.status(404).json({ message: 'Trip not found to clone.' });
    }

    const clonedTrip = await prisma.trip.create({
      data: {
        userId: req.user!.userId,
        title: `Copy of ${originalTrip.title}`,
        description: originalTrip.description,
        coverImage: originalTrip.coverImage,
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        status: 'UPCOMING',
        isPublic: false,
        totalBudget: originalTrip.totalBudget,
      },
    });

    for (const stop of originalTrip.stops) {
      const newStop = await prisma.tripStop.create({
        data: {
          tripId: clonedTrip.id,
          cityId: stop.cityId,
          title: stop.title,
          stopOrder: stop.stopOrder,
          startDate: clonedTrip.startDate,
          endDate: clonedTrip.endDate,
          budget: stop.budget,
        },
      });

      for (const item of stop.items) {
        await prisma.itineraryItem.create({
          data: {
            stopId: newStop.id,
            activityId: item.activityId,
            title: item.title,
            dayNumber: item.dayNumber,
            timeSlot: item.timeSlot,
            cost: item.cost,
            type: item.type,
            itemOrder: item.itemOrder,
          },
        });
      }
    }

    await prisma.communityPost.updateMany({
      where: { tripId: id },
      data: { clonesCount: { increment: 1 } },
    });

    return res.status(201).json(clonedTrip);
  } catch (error) {
    console.error('Error cloning trip:', error);
    return res.status(500).json({ message: 'Failed to copy trip.' });
  }
});

export default router;
