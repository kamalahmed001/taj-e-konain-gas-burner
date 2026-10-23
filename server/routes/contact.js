import express from 'express';
import db from '../database/db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// POST /api/contact — Public submit contact message
router.post('/', (req, res) => {
  try {
    const { name, phone, email = '', subject = '', message } = req.body;

    if (!name || !phone || !message) {
      return res.status(400).json({ success: false, message: 'Name, phone number, and message are required.' });
    }

    const stmt = db.prepare(`
      INSERT INTO contact_messages (name, phone, email, subject, message)
      VALUES (?, ?, ?, ?, ?)
    `);

    stmt.run(name.trim(), phone.trim(), email.trim(), subject.trim(), message.trim());

    return res.status(201).json({
      success: true,
      message: 'Thank you for your message! Our team will get back to you shortly, or contact us directly on WhatsApp at 03432833991.'
    });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return res.status(500).json({ success: false, message: 'Failed to submit contact message' });
  }
});

// GET /api/contact — Admin: list contact inquiries
router.get('/', authenticateToken, (req, res) => {
  try {
    const messages = db.prepare('SELECT * FROM contact_messages ORDER BY id DESC').all();
    return res.json({ success: true, data: messages });
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch messages' });
  }
});

export default router;
