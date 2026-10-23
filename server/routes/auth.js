import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../database/db.js';
import { authenticateToken } from '../middleware/auth.js';
import { loginRateLimiter, resetLoginAttempts } from '../middleware/rateLimiter.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'taj_e_konain_secure_jwt_token_secret_key_change_me_987654321';

// Admin Login
router.post('/login', loginRateLimiter, (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password are required.' });
  }

  try {
    const admin = db.prepare('SELECT * FROM admins WHERE username = ?').get(username.trim());

    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid administrator credentials.' });
    }

    const isValid = bcrypt.compareSync(password, admin.password_hash);
    if (!isValid) {
      return res.status(401).json({ success: false, message: 'Invalid administrator credentials.' });
    }

    // Reset rate limiter on successful login
    const ip = req.ip || req.connection.remoteAddress;
    resetLoginAttempts(ip);

    // Update last login
    db.prepare('UPDATE admins SET last_login = CURRENT_TIMESTAMP WHERE id = ?').run(admin.id);

    // Sign JWT token (valid for 24 hours)
    const token = jwt.sign(
      { id: admin.id, username: admin.username, role: 'admin' },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.json({
      success: true,
      message: 'Login successful',
      token,
      admin: {
        id: admin.id,
        username: admin.username,
        last_login: admin.last_login
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error during login.' });
  }
});

// Verify Admin Token
router.get('/verify', authenticateToken, (req, res) => {
  const admin = db.prepare('SELECT id, username, last_login, created_at FROM admins WHERE id = ?').get(req.user.id);
  if (!admin) {
    return res.status(404).json({ success: false, message: 'Admin account not found.' });
  }
  return res.json({ success: true, admin });
});

// Change Admin Password
router.post('/change-password', authenticateToken, (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ success: false, message: 'Current password and new password are required.' });
  }

  if (newPassword.length < 8) {
    return res.status(400).json({ success: false, message: 'New password must be at least 8 characters long.' });
  }

  try {
    const admin = db.prepare('SELECT * FROM admins WHERE id = ?').get(req.user.id);
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found.' });
    }

    const isValid = bcrypt.compareSync(currentPassword, admin.password_hash);
    if (!isValid) {
      return res.status(401).json({ success: false, message: 'Current password does not match.' });
    }

    const salt = bcrypt.genSaltSync(10);
    const newHash = bcrypt.hashSync(newPassword, salt);

    db.prepare('UPDATE admins SET password_hash = ? WHERE id = ?').run(newHash, admin.id);

    return res.json({ success: true, message: 'Administrator password updated successfully.' });
  } catch (error) {
    console.error('Password change error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update password.' });
  }
});

export default router;
