import express from 'express';
import db from '../database/db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/content/blocks/:page — Public read page content
router.get('/blocks/:page', (req, res) => {
  try {
    const { page } = req.params;
    const blocks = db.prepare('SELECT * FROM content_blocks WHERE page = ?').all(page);
    return res.json({ success: true, data: blocks });
  } catch (error) {
    console.error('Error fetching content blocks:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch content' });
  }
});

// PUT /api/content/blocks/:page/:section_key — Admin: Update content block
router.put('/blocks/:page/:section_key', authenticateToken, (req, res) => {
  try {
    const { page, section_key } = req.params;
    const { title, content } = req.body;

    const upsert = db.prepare(`
      INSERT INTO content_blocks (page, section_key, title, content)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(page, section_key) DO UPDATE SET
        title = excluded.title,
        content = excluded.content
    `);

    upsert.run(page, section_key, title || '', content || '');

    const updated = db.prepare('SELECT * FROM content_blocks WHERE page = ? AND section_key = ?').get(page, section_key);
    return res.json({ success: true, message: 'Content updated successfully', data: updated });
  } catch (error) {
    console.error('Error updating content block:', error);
    return res.status(500).json({ success: false, message: 'Failed to update content block' });
  }
});

// GET /api/content/faqs — Public FAQs
router.get('/faqs', (req, res) => {
  try {
    const faqs = db.prepare('SELECT * FROM faqs WHERE is_published = 1 ORDER BY display_order ASC, id ASC').all();
    return res.json({ success: true, data: faqs });
  } catch (error) {
    console.error('Error fetching faqs:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch FAQs' });
  }
});

// GET /api/content/faqs/admin — Admin all FAQs
router.get('/faqs/admin', authenticateToken, (req, res) => {
  try {
    const faqs = db.prepare('SELECT * FROM faqs ORDER BY display_order ASC, id ASC').all();
    return res.json({ success: true, data: faqs });
  } catch (error) {
    console.error('Error fetching admin faqs:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch FAQs' });
  }
});

// POST /api/content/faqs — Admin: Add FAQ
router.post('/faqs', authenticateToken, (req, res) => {
  try {
    const { question, answer, category = 'General', display_order = 0, is_published = 1 } = req.body;
    if (!question || !answer) {
      return res.status(400).json({ success: false, message: 'Question and answer are required' });
    }

    const stmt = db.prepare(`
      INSERT INTO faqs (question, answer, category, display_order, is_published)
      VALUES (?, ?, ?, ?, ?)
    `);

    const result = stmt.run(question.trim(), answer.trim(), category.trim(), Number(display_order), is_published ? 1 : 0);
    const created = db.prepare('SELECT * FROM faqs WHERE id = ?').get(result.lastInsertRowid);
    return res.status(201).json({ success: true, message: 'FAQ added', data: created });
  } catch (error) {
    console.error('Error creating FAQ:', error);
    return res.status(500).json({ success: false, message: 'Failed to create FAQ' });
  }
});

// PUT /api/content/faqs/:id — Admin: Update FAQ
router.put('/faqs/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.prepare('SELECT * FROM faqs WHERE id = ?').get(Number(id));
    if (!existing) {
      return res.status(404).json({ success: false, message: 'FAQ not found' });
    }

    const { question, answer, category, display_order, is_published } = req.body;

    const stmt = db.prepare(`
      UPDATE faqs SET
        question = ?,
        answer = ?,
        category = ?,
        display_order = ?,
        is_published = ?
      WHERE id = ?
    `);

    stmt.run(
      question !== undefined ? question.trim() : existing.question,
      answer !== undefined ? answer.trim() : existing.answer,
      category !== undefined ? category.trim() : existing.category,
      display_order !== undefined ? Number(display_order) : existing.display_order,
      is_published !== undefined ? (is_published ? 1 : 0) : existing.is_published,
      Number(id)
    );

    const updated = db.prepare('SELECT * FROM faqs WHERE id = ?').get(Number(id));
    return res.json({ success: true, message: 'FAQ updated', data: updated });
  } catch (error) {
    console.error('Error updating FAQ:', error);
    return res.status(500).json({ success: false, message: 'Failed to update FAQ' });
  }
});

// DELETE /api/content/faqs/:id — Admin: Delete FAQ
router.delete('/faqs/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM faqs WHERE id = ?').run(Number(id));
    return res.json({ success: true, message: 'FAQ deleted' });
  } catch (error) {
    console.error('Error deleting FAQ:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete FAQ' });
  }
});

export default router;
