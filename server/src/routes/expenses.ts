import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthenticatedRequest } from '../middleware/authenticate';

const router = Router();
const prisma = new PrismaClient();

// GET /api/expenses/trip/:tripId - List trip expenses and category breakdowns
router.get('/trip/:tripId', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { tripId } = req.params;

    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: {
        expenses: { orderBy: { date: 'desc' } },
        stops: { include: { items: true } },
      },
    });

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found.' });
    }

    const categoryTotals: Record<string, number> = {
      TRANSPORT: 0,
      STAY: 0,
      ACTIVITIES: 0,
      MEALS: 0,
      OTHER: 0,
    };

    let totalSpent = 0;
    trip.expenses.forEach((e) => {
      categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
      totalSpent += e.amount;
    });

    let plannedActivityCosts = 0;
    trip.stops.forEach((stop) => {
      stop.items.forEach((item) => {
        plannedActivityCosts += item.cost;
      });
    });

    return res.json({
      expenses: trip.expenses,
      categoryTotals,
      totalSpent,
      plannedActivityCosts,
      totalBudget: trip.totalBudget,
      remainingBudget: trip.totalBudget - totalSpent,
      isOverBudget: totalSpent > trip.totalBudget && trip.totalBudget > 0,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch expenses.' });
  }
});

// POST /api/expenses - Add expense to trip
router.post('/', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { tripId, category, amount, notes, date } = req.body;

    if (!tripId || !amount) {
      return res.status(400).json({ message: 'Trip ID and amount are required.' });
    }

    const trip = await prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip || (trip.userId !== req.user!.userId && req.user!.role !== 'ADMIN')) {
      return res.status(403).json({ message: 'Trip not found or unauthorized.' });
    }

    const expense = await prisma.tripExpense.create({
      data: {
        tripId,
        category: category || 'OTHER',
        amount: parseFloat(amount),
        notes,
        date: date ? new Date(date) : new Date(),
      },
    });

    return res.status(201).json(expense);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to add expense.' });
  }
});

// DELETE /api/expenses/:id - Delete expense
router.delete('/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const expense = await prisma.tripExpense.findUnique({
      where: { id },
      include: { trip: true },
    });

    if (!expense || (expense.trip.userId !== req.user!.userId && req.user!.role !== 'ADMIN')) {
      return res.status(403).json({ message: 'Expense not found or unauthorized.' });
    }

    await prisma.tripExpense.delete({ where: { id } });
    return res.json({ message: 'Expense deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete expense.' });
  }
});

export default router;
