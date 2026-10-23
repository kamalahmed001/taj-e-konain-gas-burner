import express from 'express';
import db from '../database/db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/testimonials — Public published testimonials
router.get('/', (req, res) => {
  try {
    const testimonials = db.prepare('SELECT * FROM testimonials WHERE is_published = 1 ORDER BY id DESC').all();
    return res.json({ success: true, data: testimonials });
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch testimonials' });
  }
});

// GET /api/testimonials/admin — Admin: all testimonials
router.get('/admin', authenticateToken, (req, res) => {
  try {
    const testimonials = db.prepare('SELECT * FROM testimonials ORDER BY id DESC').all();
    return res.json({ success: true, data: testimonials });
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch testimonials' });
  }
});

// POST /api/testimonials — Admin: Create testimonial
router.post('/', authenticateToken, (req, res) => {
  try {
    const {
      customer_name,
      customer_location = 'Pakistan',
      rating = 5,
      review_text,
      product_purchased = '',
      is_sample = 0,
      is_published = 1
    } = req.body;

    if (!customer_name || !review_text) {
      return res.status(400).json({ success: false, message: 'Customer name and review text are required.' });
    }

    const stmt = db.prepare(`
      INSERT INTO testimonials (customer_name, customer_location, rating, review_text, product_purchased, is_sample, is_published)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      customer_name.trim(),
      customer_location.trim(),
      Number(rating) || 5,
      review_text.trim(),
      product_purchased.trim(),
      is_sample ? 1 : 0,
      is_published ? 1 : 0
    );

    const created = db.prepare('SELECT * FROM testimonials WHERE id = ?').get(result.lastInsertRowid);
    return res.status(201).json({ success: true, message: 'Testimonial added', data: created });
  } catch (error) {
    console.error('Error creating testimonial:', error);
    return res.status(500).json({ success: false, message: 'Failed to add testimonial' });
  }
});

// PUT /api/testimonials/:id — Admin: Update testimonial
router.put('/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.prepare('SELECT * FROM testimonials WHERE id = ?').get(Number(id));
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' });
    }

    const {
      customer_name,
      customer_location,
      rating,
      review_text,
      product_purchased,
      is_sample,
      is_published
    } = req.body;

    const stmt = db.prepare(`
      UPDATE testimonials SET
        customer_name = ?,
        customer_location = ?,
        rating = ?,
        review_text = ?,
        product_purchased = ?,
        is_sample = ?,
        is_published = ?
      WHERE id = ?
    `);

    stmt.run(
      customer_name !== undefined ? customer_name.trim() : existing.customer_name,
      customer_location !== undefined ? customer_location.trim() : existing.customer_location,
      rating !== undefined ? Number(rating) : existing.rating,
      review_text !== undefined ? review_text.trim() : existing.review_text,
      product_purchased !== undefined ? product_purchased.trim() : existing.product_purchased,
      is_sample !== undefined ? (is_sample ? 1 : 0) : existing.is_sample,
      is_published !== undefined ? (is_published ? 1 : 0) : existing.is_published,
      Number(id)
    );

    const updated = db.prepare('SELECT * FROM testimonials WHERE id = ?').get(Number(id));
    return res.json({ success: true, message: 'Testimonial updated', data: updated });
  } catch (error) {
    console.error('Error updating testimonial:', error);
    return res.status(500).json({ success: false, message: 'Failed to update testimonial' });
  }
});

// DELETE /api/testimonials/:id — Admin: Delete testimonial
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM testimonials WHERE id = ?').run(Number(id));
    return res.json({ success: true, message: 'Testimonial deleted' });
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete testimonial' });
  }
});

export default router;
