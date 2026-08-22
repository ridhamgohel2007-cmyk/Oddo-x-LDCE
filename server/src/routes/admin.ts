import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthenticatedRequest } from '../middleware/authenticate';
import { requireAdmin } from '../middleware/rbac';

const router = Router();
const prisma = new PrismaClient();

// GET /api/admin/analytics - Overview metrics & chart data for Admin Dashboard
router.get('/analytics', authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalTrips = await prisma.trip.count();
    const totalCities = await prisma.city.count();
    const totalActivities = await prisma.activity.count();
    const totalCommunityPosts = await prisma.communityPost.count();

    // Top cities by stop occurrences
    const popularCities = await prisma.city.findMany({
      take: 5,
      orderBy: { popularityScore: 'desc' },
      include: {
        _count: { select: { stops: true } },
      },
    });

    // Top activities
    const popularActivities = await prisma.activity.findMany({
      take: 5,
      include: {
        city: true,
        _count: { select: { itineraryItems: true } },
      },
      orderBy: { estimatedCost: 'desc' },
    });

    // Recent user signups
    const users = await prisma.user.findMany({
      take: 20,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        city: true,
        country: true,
        createdAt: true,
        _count: { select: { trips: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Monthly trip creation trend (mock aggregation format for Recharts)
    const tripTrends = [
      { month: 'Jan', count: 12 },
      { month: 'Feb', count: 18 },
      { month: 'Mar', count: 25 },
      { month: 'Apr', count: 32 },
      { month: 'May', count: 45 },
      { month: 'Jun', count: 60 },
      { month: 'Jul', count: 78 },
      { month: 'Aug', count: totalTrips },
    ];

    // Status breakdown
    const statusCounts = await prisma.trip.groupBy({
      by: ['status'],
      _count: { id: true },
    });

    return res.json({
      summary: {
        totalUsers,
        totalTrips,
        totalCities,
        totalActivities,
        totalCommunityPosts,
      },
      popularCities,
      popularActivities,
      users,
      tripTrends,
      statusCounts,
    });
  } catch (error) {
    console.error('Analytics error:', error);
    return res.status(500).json({ message: 'Failed to fetch admin analytics.' });
  }
});

// GET /api/admin/users - Get all users
router.get('/users', authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        city: true,
        country: true,
        createdAt: true,
        _count: { select: { trips: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return res.json(users);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch users.' });
  }
});

// PUT /api/admin/users/:id/role - Update user role
router.put('/users/:id/role', authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const updated = await prisma.user.update({
      where: { id },
      data: { role },
    });
    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update user role.' });
  }
});

// DELETE /api/admin/users/:id - Delete user
router.delete('/users/:id', authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.user.delete({ where: { id } });
    return res.json({ message: 'User deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete user.' });
  }
});

export default router;
