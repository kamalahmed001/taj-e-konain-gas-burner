import express from 'express';
import db from '../database/db.js';
import { authenticateToken } from '../middleware/auth.js';
import { autoSaveSnapshot } from './backup.js';

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

function parseProduct(p) {
  if (!p) return null;
  let parsedSpecs = {};
  let parsedImages = [];

  try {
    parsedSpecs = p.specifications ? JSON.parse(p.specifications) : {};
  } catch (e) {
    parsedSpecs = { details: p.specifications };
  }

  try {
    parsedImages = p.images ? JSON.parse(p.images) : [];
  } catch (e) {
    parsedImages = p.primary_image ? [p.primary_image] : [];
  }

  if (parsedImages.length === 0 && p.primary_image) {
    parsedImages = [p.primary_image];
  }

  return {
    ...p,
    specifications: parsedSpecs,
    images: parsedImages,
    is_available: Boolean(p.is_available),
    is_featured: Boolean(p.is_featured),
    is_published: Boolean(p.is_published)
  };
}

// GET /api/products — Public listing with filtering, searching, sorting
router.get('/', (req, res) => {
  try {
    const {
      search,
      category,
      featured,
      sort,
      minPrice,
      maxPrice,
      page = 1,
      limit = 50,
      admin = false
    } = req.query;

    let query = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    // Filter by publish status unless admin mode
    if (!admin) {
      query += ' AND is_published = 1';
    }

    if (search) {
      query += ' AND (name LIKE ? OR sku LIKE ? OR short_description LIKE ? OR description LIKE ?)';
      const term = `%${search.trim()}%`;
      params.push(term, term, term, term);
    }

    if (category) {
      query += ' AND category_slug = ?';
      params.push(category.trim());
    }

    if (featured === 'true' || featured === '1') {
      query += ' AND is_featured = 1';
    }

    if (minPrice) {
      query += ' AND price >= ?';
      params.push(Number(minPrice));
    }

    if (maxPrice) {
      query += ' AND price <= ?';
      params.push(Number(maxPrice));
    }

    // Sorting
    if (sort === 'price_asc') {
      query += ' ORDER BY price ASC';
    } else if (sort === 'price_desc') {
      query += ' ORDER BY price DESC';
    } else if (sort === 'name_asc') {
      query += ' ORDER BY name ASC';
    } else if (sort === 'name_desc') {
      query += ' ORDER BY name DESC';
    } else if (sort === 'featured') {
      query += ' ORDER BY is_featured DESC, id DESC';
    } else {
      query += ' ORDER BY id DESC'; // default newest first
    }

    // Pagination
    const numLimit = parseInt(limit, 10) || 50;
    const numPage = parseInt(page, 10) || 1;
    const offset = (numPage - 1) * numLimit;

    // Total count for pagination metadata
    let countQuery = query.replace('SELECT *', 'SELECT COUNT(*) as total');
    const totalRow = db.prepare(countQuery).get(...params);
    const total = totalRow ? totalRow.total : 0;

    query += ' LIMIT ? OFFSET ?';
    params.push(numLimit, offset);

    const rows = db.prepare(query).all(...params);
    const products = rows.map(parseProduct);

    return res.json({
      success: true,
      data: products,
      pagination: {
        total,
        page: numPage,
        limit: numLimit,
        totalPages: Math.ceil(total / numLimit)
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch products' });
  }
});

// GET /api/products/:slugOrId — Public single product by slug or id + related items
router.get('/:slugOrId', (req, res) => {
  try {
    const { slugOrId } = req.params;
    let product = null;

    if (/^\d+$/.test(slugOrId)) {
      product = db.prepare('SELECT * FROM products WHERE id = ?').get(Number(slugOrId));
    }

    if (!product) {
      product = db.prepare('SELECT * FROM products WHERE slug = ?').get(slugOrId);
    }

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const parsed = parseProduct(product);

    // Fetch related products from same category or fallback to other featured products
    let related = [];
    if (parsed.category_slug) {
      const relRows = db.prepare(`
        SELECT * FROM products 
        WHERE category_slug = ? AND id != ? AND is_published = 1 
        ORDER BY is_featured DESC, id DESC 
        LIMIT 4
      `).all(parsed.category_slug, parsed.id);
      related = relRows.map(parseProduct);
    }

    if (related.length < 4) {
      const existingIds = [parsed.id, ...related.map(r => r.id)];
      const placeholders = existingIds.map(() => '?').join(',');
      const fallbackRows = db.prepare(`
        SELECT * FROM products 
        WHERE id NOT IN (${placeholders}) AND is_published = 1 
        ORDER BY is_featured DESC, id DESC 
        LIMIT ?
      `).all(...existingIds, 4 - related.length);
      related = [...related, ...fallbackRows.map(parseProduct)];
    }

    return res.json({
      success: true,
      data: parsed,
      related
    });
  } catch (error) {
    console.error('Error fetching single product:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch product details' });
  }
});

// POST /api/products — Admin protected: Create product
router.post('/', authenticateToken, (req, res) => {
  try {
    const {
      name,
      sku,
      category_id,
      short_description = '',
      description = '',
      specifications = {},
      price,
      discount_price = null,
      stock_quantity = 10,
      is_available = 1,
      is_featured = 0,
      is_published = 1,
      primary_image = '',
      images = [],
      meta_title = '',
      meta_description = ''
    } = req.body;

    if (!name || !price) {
      return res.status(400).json({ success: false, message: 'Product name and price are required.' });
    }

    const generatedSku = sku ? sku.trim().toUpperCase() : `TK-${Date.now().toString().slice(-6)}`;
    let slug = slugify(name);

    // Check unique slug
    const existingSlug = db.prepare('SELECT id FROM products WHERE slug = ?').get(slug);
    if (existingSlug) {
      slug = `${slug}-${Math.floor(1000 + Math.random() * 9000)}`;
    }

    // Get category info
    let catSlug = '';
    let catName = '';
    if (category_id) {
      const cat = db.prepare('SELECT slug, name FROM categories WHERE id = ?').get(category_id);
      if (cat) {
        catSlug = cat.slug;
        catName = cat.name;
      }
    }

    const specString = typeof specifications === 'object' ? JSON.stringify(specifications) : specifications;
    const imagesString = Array.isArray(images) ? JSON.stringify(images) : JSON.stringify([primary_image || '']);

    const stmt = db.prepare(`
      INSERT INTO products (
        sku, name, slug, category_id, category_slug, category_name,
        short_description, description, specifications, price, discount_price,
        stock_quantity, is_available, is_featured, is_published,
        primary_image, images, meta_title, meta_description
      ) VALUES (
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?, ?
      )
    `);

    const result = stmt.run(
      generatedSku,
      name.trim(),
      slug,
      category_id || null,
      catSlug,
      catName,
      short_description,
      description,
      specString,
      Number(price),
      discount_price ? Number(discount_price) : null,
      Number(stock_quantity),
      is_available ? 1 : 0,
      is_featured ? 1 : 0,
      is_published ? 1 : 0,
      primary_image || (images && images[0]) || '',
      imagesString,
      meta_title || `${name.trim()} - Taj-e-Konain Gas Burner`,
      meta_description || short_description || `Buy ${name.trim()} at Taj-e-Konain Gas Burner. Reliable quality in Pakistan.`
    );

    const newProduct = db.prepare('SELECT * FROM products WHERE id = ?').get(result.lastInsertRowid);
    autoSaveSnapshot();

    return res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: parseProduct(newProduct)
    });
  } catch (error) {
    console.error('Error creating product:', error);
    return res.status(500).json({ success: false, message: error.message || 'Failed to create product' });
  }
});

// PUT /api/products/:id — Admin protected: Update product
router.put('/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(Number(id));
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const {
      name,
      sku,
      category_id,
      short_description,
      description,
      specifications,
      price,
      discount_price,
      stock_quantity,
      is_available,
      is_featured,
      is_published,
      primary_image,
      images,
      meta_title,
      meta_description
    } = req.body;

    let catSlug = existing.category_slug;
    let catName = existing.category_name;
    if (category_id !== undefined && category_id !== existing.category_id) {
      const cat = db.prepare('SELECT slug, name FROM categories WHERE id = ?').get(category_id);
      if (cat) {
        catSlug = cat.slug;
        catName = cat.name;
      }
    }

    const specString = specifications !== undefined 
      ? (typeof specifications === 'object' ? JSON.stringify(specifications) : specifications) 
      : existing.specifications;

    const imagesString = images !== undefined 
      ? (Array.isArray(images) ? JSON.stringify(images) : JSON.stringify([primary_image || ''])) 
      : existing.images;

    const updatedName = name !== undefined ? name.trim() : existing.name;
    const updatedSku = sku !== undefined ? sku.trim().toUpperCase() : existing.sku;

    const stmt = db.prepare(`
      UPDATE products SET
        name = ?,
        sku = ?,
        category_id = ?,
        category_slug = ?,
        category_name = ?,
        short_description = ?,
        description = ?,
        specifications = ?,
        price = ?,
        discount_price = ?,
        stock_quantity = ?,
        is_available = ?,
        is_featured = ?,
        is_published = ?,
        primary_image = ?,
        images = ?,
        meta_title = ?,
        meta_description = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    stmt.run(
      updatedName,
      updatedSku,
      category_id !== undefined ? category_id : existing.category_id,
      catSlug,
      catName,
      short_description !== undefined ? short_description : existing.short_description,
      description !== undefined ? description : existing.description,
      specString,
      price !== undefined ? Number(price) : existing.price,
      discount_price !== undefined ? (discount_price ? Number(discount_price) : null) : existing.discount_price,
      stock_quantity !== undefined ? Number(stock_quantity) : existing.stock_quantity,
      is_available !== undefined ? (is_available ? 1 : 0) : existing.is_available,
      is_featured !== undefined ? (is_featured ? 1 : 0) : existing.is_featured,
      is_published !== undefined ? (is_published ? 1 : 0) : existing.is_published,
      primary_image !== undefined ? primary_image : existing.primary_image,
      imagesString,
      meta_title !== undefined ? meta_title : existing.meta_title,
      meta_description !== undefined ? meta_description : existing.meta_description,
      Number(id)
    );

    const updated = db.prepare('SELECT * FROM products WHERE id = ?').get(Number(id));
    autoSaveSnapshot();

    return res.json({
      success: true,
      message: 'Product updated successfully',
      data: parseProduct(updated)
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return res.status(500).json({ success: false, message: error.message || 'Failed to update product' });
  }
});

// DELETE /api/products/:id — Admin protected: Delete product
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.prepare('SELECT id, name FROM products WHERE id = ?').get(Number(id));
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    db.prepare('DELETE FROM products WHERE id = ?').run(Number(id));
    autoSaveSnapshot();
    return res.json({ success: true, message: `Product '${existing.name}' deleted successfully.` });
  } catch (error) {
    console.error('Error deleting product:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete product' });
  }
});

export default router;
