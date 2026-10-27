import express from 'express';
import db from '../database/db.js';
import { authenticateToken } from '../middleware/auth.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();

const snapshotPath = path.resolve(__dirname, '../database/snapshot.json');

// Helper to dump all tables to a JS object
export function getFullBackupData() {
  const categories = db.prepare('SELECT * FROM categories ORDER BY display_order ASC, id ASC').all();
  const products = db.prepare('SELECT * FROM products ORDER BY id ASC').all();
  const settings = db.prepare('SELECT * FROM store_settings').all();
  const testimonials = db.prepare('SELECT * FROM testimonials ORDER BY id ASC').all();
  const faqs = db.prepare('SELECT * FROM faqs ORDER BY display_order ASC, id ASC').all();
  const content = db.prepare('SELECT * FROM content_blocks').all();

  return {
    version: '1.0',
    exported_at: new Date().toISOString(),
    store: 'Taj-e-Konain Gas Burner',
    data: {
      categories,
      products,
      settings,
      testimonials,
      faqs,
      content
    }
  };
}

// Helper to restore from backup data
export function restoreFromBackupData(backupData) {
  if (!backupData || !backupData.data) {
    throw new Error('Invalid backup format');
  }

  const { categories, products, settings, testimonials, faqs, content } = backupData.data;

  // Use a transaction if possible or atomic writes
  if (categories && Array.isArray(categories)) {
    db.exec('DELETE FROM categories;');
    const insertCat = db.prepare(`
      INSERT INTO categories (id, name, slug, description, image_url, display_order, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    categories.forEach(c => {
      insertCat.run(c.id, c.name, c.slug, c.description || null, c.image_url || null, c.display_order || 0, c.created_at || new Date().toISOString());
    });
  }

  if (products && Array.isArray(products)) {
    db.exec('DELETE FROM products;');
    const insertProd = db.prepare(`
      INSERT INTO products (
        id, sku, name, slug, category_id, category_slug, category_name,
        short_description, description, specifications, price, discount_price,
        stock_quantity, is_available, is_featured, is_published,
        primary_image, images, meta_title, meta_description, created_at, updated_at
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?
      )
    `);
    products.forEach(p => {
      insertProd.run(
        p.id, p.sku, p.name, p.slug, p.category_id || null, p.category_slug || null, p.category_name || null,
        p.short_description || null, p.description || null,
        typeof p.specifications === 'object' ? JSON.stringify(p.specifications) : (p.specifications || '{}'),
        p.price, p.discount_price || null,
        p.stock_quantity ?? 10, p.is_available ?? 1, p.is_featured ?? 0, p.is_published ?? 1,
        p.primary_image || null,
        typeof p.images === 'object' ? JSON.stringify(p.images) : (p.images || '[]'),
        p.meta_title || null, p.meta_description || null,
        p.created_at || new Date().toISOString(), p.updated_at || new Date().toISOString()
      );
    });
  }

  if (settings && Array.isArray(settings)) {
    const upsertSetting = db.prepare(`
      INSERT INTO store_settings (key, value, updated_at)
      VALUES (?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(key) DO UPDATE SET value=excluded.value, updated_at=CURRENT_TIMESTAMP
    `);
    settings.forEach(s => {
      upsertSetting.run(s.key, s.value);
    });
  }

  if (testimonials && Array.isArray(testimonials)) {
    db.exec('DELETE FROM testimonials;');
    const insertTest = db.prepare(`
      INSERT INTO testimonials (id, customer_name, customer_location, rating, review_text, product_purchased, is_sample, is_published, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    testimonials.forEach(t => {
      insertTest.run(t.id, t.customer_name, t.customer_location || null, t.rating || 5, t.review_text, t.product_purchased || null, t.is_sample ?? 0, t.is_published ?? 1, t.created_at || new Date().toISOString());
    });
  }

  if (faqs && Array.isArray(faqs)) {
    db.exec('DELETE FROM faqs;');
    const insertFaq = db.prepare(`
      INSERT INTO faqs (id, question, answer, category, display_order, is_published, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    faqs.forEach(f => {
      insertFaq.run(f.id, f.question, f.answer, f.category || 'General', f.display_order || 0, f.is_published ?? 1, f.created_at || new Date().toISOString());
    });
  }

  // Also write to snapshot.json
  try {
    fs.writeFileSync(snapshotPath, JSON.stringify(backupData, null, 2), 'utf-8');
  } catch (e) {
    console.warn('Could not write snapshot.json:', e.message);
  }

  return true;
}

// Auto-save snapshot on any DB change
export function autoSaveSnapshot() {
  try {
    const data = getFullBackupData();
    fs.writeFileSync(snapshotPath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    // Non-fatal
  }
}

// GET /api/backup/export — Download full store data as JSON (Admin only)
router.get('/export', authenticateToken, (req, res) => {
  try {
    const backup = getFullBackupData();
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="taj-e-konain-backup-${new Date().toISOString().slice(0, 10)}.json"`);
    return res.json(backup);
  } catch (err) {
    console.error('Export error:', err);
    return res.status(500).json({ success: false, message: 'Failed to generate backup' });
  }
});

// POST /api/backup/import — Restore full store data from JSON (Admin only)
router.post('/import', authenticateToken, (req, res) => {
  try {
    const backupData = req.body;
    restoreFromBackupData(backupData);

    const productCount = db.prepare('SELECT COUNT(*) as count FROM products').get().count;
    const categoryCount = db.prepare('SELECT COUNT(*) as count FROM categories').get().count;

    return res.json({
      success: true,
      message: `Store restored successfully! ${productCount} products, ${categoryCount} categories loaded.`,
      productCount,
      categoryCount
    });
  } catch (err) {
    console.error('Import error:', err);
    return res.status(400).json({ success: false, message: err.message || 'Failed to restore backup' });
  }
});

// GET /api/backup/status — Quick overview of stored records
router.get('/status', authenticateToken, (req, res) => {
  try {
    const products = db.prepare('SELECT COUNT(*) as count FROM products').get().count;
    const categories = db.prepare('SELECT COUNT(*) as count FROM categories').get().count;
    const settings = db.prepare('SELECT COUNT(*) as count FROM store_settings').get().count;
    const faqs = db.prepare('SELECT COUNT(*) as count FROM faqs').get().count;
    const hasSnapshot = fs.existsSync(snapshotPath);

    return res.json({
      success: true,
      data: {
        products,
        categories,
        settings,
        faqs,
        hasLocalSnapshot: hasSnapshot
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to get backup status' });
  }
});

export default router;
