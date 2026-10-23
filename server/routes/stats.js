import express from 'express';
import db from '../database/db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/stats/dashboard — Admin dashboard statistics
router.get('/dashboard', authenticateToken, (req, res) => {
  try {
    const totalProducts = db.prepare('SELECT COUNT(*) as count FROM products').get().count;
    const availableProducts = db.prepare('SELECT COUNT(*) as count FROM products WHERE is_available = 1 AND stock_quantity > 0').get().count;
    const outOfStock = db.prepare('SELECT COUNT(*) as count FROM products WHERE is_available = 0 OR stock_quantity <= 0').get().count;
    const featuredProducts = db.prepare('SELECT COUNT(*) as count FROM products WHERE is_featured = 1').get().count;
    const publishedProducts = db.prepare('SELECT COUNT(*) as count FROM products WHERE is_published = 1').get().count;

    const totalCategories = db.prepare('SELECT COUNT(*) as count FROM categories').get().count;
    const categoryCounts = db.prepare(`
      SELECT c.id, c.name, c.slug, COUNT(p.id) as product_count
      FROM categories c
      LEFT JOIN products p ON p.category_id = c.id
      GROUP BY c.id
      ORDER BY product_count DESC
    `).all();

    const recentProducts = db.prepare(`
      SELECT id, name, sku, price, stock_quantity, is_available, is_published, updated_at
      FROM products
      ORDER BY updated_at DESC
      LIMIT 6
    `).all();

    const totalInquiries = db.prepare('SELECT COUNT(*) as count FROM contact_messages').get().count;

    return res.json({
      success: true,
      data: {
        totalProducts,
        availableProducts,
        outOfStock,
        featuredProducts,
        publishedProducts,
        totalCategories,
        categoryCounts,
        recentProducts,
        totalInquiries
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch dashboard statistics' });
  }
});

export default router;
