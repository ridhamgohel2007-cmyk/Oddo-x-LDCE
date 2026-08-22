import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { generateToken } from '../utils/auth';
import { authenticateToken, AuthenticatedRequest } from '../middleware/authenticate';

const router = Router();
const prisma = new PrismaClient();

// POST /api/auth/register - Simplified onboarding (Full Name, Email, Password)
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, role } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ message: 'Full Name, Email, and Password are required.' });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: 'A user account with this email already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const userRole = role === 'ADMIN' ? 'ADMIN' : 'USER';

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        role: userRole,
      },
    });

    const token = generateToken({ userId: user.id, email: user.email, role: user.role });

    return res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        phone: user.phone,
        city: user.city,
        country: user.country,
        bio: user.bio,
        profilePic: user.profilePic,
        language: user.language,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ message: 'Server error during registration.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = generateToken({ userId: user.id, email: user.email, role: user.role });

    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        phone: user.phone,
        city: user.city,
        country: user.country,
        bio: user.bio,
        profilePic: user.profilePic,
        language: user.language,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error during login.' });
  }
});

// POST /api/auth/forgot-password - Password Reset Flow
router.post('/forgot-password', async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email address is required.' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'No account found with this email address.' });
    }

    const passwordToSet = newPassword || 'password123';
    const passwordHash = await bcrypt.hash(passwordToSet, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash },
    });

    return res.json({
      message: `Password reset successfully for ${email}. You can now log in with your new password!`,
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({ message: 'Failed to process password reset request.' });
  }
});

// GET /api/auth/me
router.get('/me', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    return res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      phone: user.phone,
      city: user.city,
      country: user.country,
      bio: user.bio,
      profilePic: user.profilePic,
      language: user.language,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to retrieve profile.' });
  }
});

// PUT /api/auth/profile
router.put('/profile', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, phone, city, country, bio, profilePic, language } = req.body;

    const updated = await prisma.user.update({
      where: { id: req.user!.userId },
      data: {
        name,
        phone,
        city,
        country,
        bio,
        profilePic,
        language,
      },
    });

    return res.json({
      id: updated.id,
      email: updated.email,
      name: updated.name,
      role: updated.role,
      phone: updated.phone,
      city: updated.city,
      country: updated.country,
      bio: updated.bio,
      profilePic: updated.profilePic,
      language: updated.language,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update profile.' });
  }
});

// DELETE /api/auth/account
router.delete('/account', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    await prisma.user.delete({
      where: { id: req.user!.userId },
    });
    return res.json({ message: 'Account deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete account.' });
  }
});

export default router;
