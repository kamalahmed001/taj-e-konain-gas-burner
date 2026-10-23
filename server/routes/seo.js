import express from 'express';
import db from '../database/db.js';

const router = express.Router();

function getBaseUrl(req) {
  // Check store setting first
  try {
    const domainSetting = db.prepare('SELECT value FROM store_settings WHERE key = ?').get('production_domain');
    if (domainSetting && domainSetting.value && domainSetting.value.startsWith('http')) {
      return domainSetting.value.replace(/\/+$/, '');
    }
  } catch (e) {}

  const host = req.get('host');
  const protocol = req.protocol || 'http';
  return `${protocol}://${host}`;
}

// GET /sitemap.xml
router.get('/sitemap.xml', (req, res) => {
  try {
    const baseUrl = getBaseUrl(req);
    const currentDate = new Date().toISOString().split('T')[0];

    // Static public routes
    const staticPages = [
      { path: '', changefreq: 'daily', priority: '1.0' },
      { path: '/shop', changefreq: 'daily', priority: '0.9' },
      { path: '/about', changefreq: 'monthly', priority: '0.7' },
      { path: '/contact', changefreq: 'monthly', priority: '0.7' },
      { path: '/faq', changefreq: 'monthly', priority: '0.6' },
      { path: '/shipping-policy', changefreq: 'monthly', priority: '0.5' },
      { path: '/returns-policy', changefreq: 'monthly', priority: '0.5' },
      { path: '/privacy-policy', changefreq: 'monthly', priority: '0.5' },
      { path: '/terms', changefreq: 'monthly', priority: '0.5' }
    ];

    // Published Products
    const products = db.prepare(`
      SELECT slug, updated_at 
      FROM products 
      WHERE is_published = 1 
      ORDER BY id DESC
    `).all();

    // Categories
    const categories = db.prepare('SELECT slug FROM categories ORDER BY id ASC').all();

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // Add static pages
    staticPages.forEach(p => {
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}${p.path}</loc>\n`;
      xml += `    <lastmod>${currentDate}</lastmod>\n`;
      xml += `    <changefreq>${p.changefreq}</changefreq>\n`;
      xml += `    <priority>${p.priority}</priority>\n`;
      xml += `  </url>\n`;
    });

    // Add categories
    categories.forEach(c => {
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}/shop?category=${encodeURIComponent(c.slug)}</loc>\n`;
      xml += `    <lastmod>${currentDate}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.8</priority>\n`;
      xml += `  </url>\n`;
    });

    // Add products
    products.forEach(p => {
      const lastMod = p.updated_at ? p.updated_at.split(' ')[0] : currentDate;
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}/product/${p.slug}</loc>\n`;
      xml += `    <lastmod>${lastMod}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.85</priority>\n`;
      xml += `  </url>\n`;
    });

    xml += `</urlset>`;

    res.header('Content-Type', 'application/xml');
    return res.send(xml);
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return res.status(500).send('Error generating sitemap');
  }
});

// GET /robots.txt
router.get('/robots.txt', (req, res) => {
  const baseUrl = getBaseUrl(req);
  const content = `# Robots.txt for Taj-e-Konain Gas Burner
User-agent: *
Allow: /
Disallow: /admin
Disallow: /admin/*
Disallow: /api/*

# Dynamic XML Sitemap
Sitemap: ${baseUrl}/sitemap.xml
`;
  res.header('Content-Type', 'text/plain');
  return res.send(content);
});

export default router;
