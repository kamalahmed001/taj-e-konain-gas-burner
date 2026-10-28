import express from 'express';
import db from '../database/db.js';
import { authenticateToken } from '../middleware/auth.js';
import { autoSaveSnapshot } from './backup.js';
import { executeTurso } from '../database/turso.js';

const router = express.Router();

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

// GET /api/categories — List categories with product count
router.get('/', (req, res) => {
  try {
    const categories = db.prepare(`
      SELECT c.*, 
        (SELECT COUNT(*) FROM products p WHERE p.category_id = c.id AND p.is_published = 1) as product_count
      FROM categories c
      ORDER BY c.display_order ASC, c.name ASC
    `).all();

    return res.json({ success: true, data: categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch categories' });
  }
});

// GET /api/categories/:slug — Single category
router.get('/:slug', (req, res) => {
  try {
    const { slug } = req.params;
    const category = db.prepare('SELECT * FROM categories WHERE slug = ?').get(slug);

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    return res.json({ success: true, data: category });
  } catch (error) {
    console.error('Error fetching category:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch category' });
  }
});

// POST /api/categories — Admin protected: Create category
router.post('/', authenticateToken, (req, res) => {
  try {
    const { name, description = '', image_url = '', display_order = 0 } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Category name is required.' });
    }

    let slug = slugify(name);
    const existing = db.prepare('SELECT id FROM categories WHERE slug = ?').get(slug);
    if (existing) {
      slug = `${slug}-${Math.floor(100 + Math.random() * 900)}`;
    }

    const stmt = db.prepare(`
      INSERT INTO categories (name, slug, description, image_url, display_order)
      VALUES (?, ?, ?, ?, ?)
    `);

    const result = stmt.run(name.trim(), slug, description, image_url, Number(display_order));
    const newCat = db.prepare('SELECT * FROM categories WHERE id = ?').get(result.lastInsertRowid);
    
    // Save to Turso cloud
    executeTurso('INSERT INTO categories (id, name, slug, description, image_url, display_order) VALUES (?, ?, ?, ?, ?, ?)', [
      newCat.id, newCat.name, newCat.slug, newCat.description, newCat.image_url, newCat.display_order
    ]).catch(() => {});

    autoSaveSnapshot();

    return res.status(201).json({ success: true, message: 'Category created', data: newCat });
  } catch (error) {
    console.error('Error creating category:', error);
    return res.status(500).json({ success: false, message: 'Failed to create category' });
  }
});

// PUT /api/categories/:id — Admin protected: Update category
router.put('/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.prepare('SELECT * FROM categories WHERE id = ?').get(Number(id));
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    const { name, description, image_url, display_order } = req.body;

    const stmt = db.prepare(`
      UPDATE categories SET
        name = ?,
        description = ?,
        image_url = ?,
        display_order = ?
      WHERE id = ?
    `);

    stmt.run(
      name !== undefined ? name.trim() : existing.name,
      description !== undefined ? description : existing.description,
      image_url !== undefined ? image_url : existing.image_url,
      display_order !== undefined ? Number(display_order) : existing.display_order,
      Number(id)
    );

    // Also update cached category_name in products if name changed
    if (name && name.trim() !== existing.name) {
      db.prepare('UPDATE products SET category_name = ? WHERE category_id = ?').run(name.trim(), Number(id));
    }

    const updated = db.prepare('SELECT * FROM categories WHERE id = ?').get(Number(id));
    
    // Update in Turso cloud
    executeTurso('UPDATE categories SET name = ?, description = ?, image_url = ?, display_order = ? WHERE id = ?', [
      updated.name, updated.description, updated.image_url, updated.display_order, Number(id)
    ]).catch(() => {});

    autoSaveSnapshot();
    return res.json({ success: true, message: 'Category updated', data: updated });
  } catch (error) {
    console.error('Error updating category:', error);
    return res.status(500).json({ success: false, message: 'Failed to update category' });
  }
});

// DELETE /api/categories/:id — Admin protected: Delete category
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.prepare('SELECT * FROM categories WHERE id = ?').get(Number(id));
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    // Set category_id = NULL on affected products
    db.prepare('UPDATE products SET category_id = NULL, category_slug = NULL, category_name = NULL WHERE category_id = ?').run(Number(id));
    db.prepare('DELETE FROM categories WHERE id = ?').run(Number(id));
    
    // Delete in Turso cloud
    executeTurso('DELETE FROM categories WHERE id = ?', [Number(id)]).catch(() => {});
    executeTurso('UPDATE products SET category_id = NULL, category_slug = NULL, category_name = NULL WHERE category_id = ?', [Number(id)]).catch(() => {});

    autoSaveSnapshot();

    return res.json({ success: true, message: `Category '${existing.name}' deleted successfully.` });
  } catch (error) {
    console.error('Error deleting category:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete category' });
  }
});

export default router;
