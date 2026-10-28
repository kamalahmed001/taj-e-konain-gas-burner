import { createClient } from '@libsql/client';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TURSO_DATABASE_URL = process.env.TURSO_DATABASE_URL || 'libsql://taj-e-konain-pashaax40.aws-ap-southeast-1.turso.io';
const TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN || 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3OTMyMjAzOTgsImlkIjoiMDFhMTg0NDEtZjcwMS03NDg2LTg5OTItNWQyMWQ3NjdhNTJiIiwia2lkIjoiVGRnTDJaVFd2WjdZZ050bF9Pd1Vka3VHU1lxVXpidGFQVEdXQjlsOE52MCIsInJpZCI6ImM3ZDIyOWYzLWRhNTktNDJlMC05OTA2LWZhYjhhNjkyYWYzMCJ9.vngSPqJet8OW8rprgeZfQNPxu8GVpoEswVpTd_YgBSVKBM6Zd_6dKfne1k9qH9_RzfoFa2c0pDuHNHTOgts8Bw';

console.log('Connecting to Turso at:', TURSO_DATABASE_URL);

const client = createClient({
  url: TURSO_DATABASE_URL,
  authToken: TURSO_AUTH_TOKEN
});

async function migrate() {
  console.log('--- 1. Creating Database Schema in Turso ---');

  const statements = [
    `CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_login DATETIME
    );`,

    `CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT,
      image_url TEXT,
      display_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );`,

    `CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sku TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      category_id INTEGER,
      category_slug TEXT,
      category_name TEXT,
      short_description TEXT,
      description TEXT,
      specifications TEXT,
      price REAL NOT NULL,
      discount_price REAL,
      stock_quantity INTEGER DEFAULT 10,
      is_available INTEGER DEFAULT 1,
      is_featured INTEGER DEFAULT 0,
      is_published INTEGER DEFAULT 1,
      primary_image TEXT,
      images TEXT,
      meta_title TEXT,
      meta_description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );`,

    `CREATE TABLE IF NOT EXISTS testimonials (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_name TEXT NOT NULL,
      customer_location TEXT,
      rating INTEGER DEFAULT 5,
      review_text TEXT NOT NULL,
      product_purchased TEXT,
      is_sample INTEGER DEFAULT 1,
      is_published INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );`,

    `CREATE TABLE IF NOT EXISTS store_settings (
      key TEXT PRIMARY KEY,
      value TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );`,

    `CREATE TABLE IF NOT EXISTS content_blocks (
      page TEXT NOT NULL,
      section_key TEXT NOT NULL,
      title TEXT,
      content TEXT,
      extra_data TEXT,
      PRIMARY KEY (page, section_key)
    );`,

    `CREATE TABLE IF NOT EXISTS faqs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      question TEXT NOT NULL,
      answer TEXT NOT NULL,
      category TEXT DEFAULT 'General',
      display_order INTEGER DEFAULT 0,
      is_published INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );`,

    `CREATE TABLE IF NOT EXISTS contact_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT,
      subject TEXT,
      message TEXT NOT NULL,
      status TEXT DEFAULT 'unread',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );`
  ];

  for (const sql of statements) {
    await client.execute(sql);
  }
  console.log('Schema created successfully in Turso!');

  // Read snapshot.json
  const snapshotFile = path.resolve(__dirname, '../database/snapshot.json');
  if (!fs.existsSync(snapshotFile)) {
    console.error('snapshot.json not found!');
    return;
  }

  const raw = fs.readFileSync(snapshotFile, 'utf-8');
  const snapshot = JSON.parse(raw);
  const data = snapshot.data;

  // Insert Admin
  console.log('--- 2. Migrating Admin Credentials ---');
  await client.execute({
    sql: `INSERT INTO admins (id, username, password_hash)
          VALUES (1, 'admin', '$2a$10$wT0a33D.j3Vp3wAomlT0.ecqH10tL9MsqzXo7hA/Bkyz6p1/5gZvy')
          ON CONFLICT(username) DO NOTHING;`,
    args: []
  });

  // Insert Categories
  console.log(`--- 3. Migrating ${data.categories.length} Categories ---`);
  for (const c of data.categories) {
    await client.execute({
      sql: `INSERT INTO categories (id, name, slug, description, image_url, display_order)
            VALUES (?, ?, ?, ?, ?, ?)
            ON CONFLICT(slug) DO NOTHING;`,
      args: [c.id, c.name, c.slug, c.description || null, c.image_url || null, c.display_order || 0]
    });
  }

  // Insert Products
  console.log(`--- 4. Migrating ${data.products.length} Products ---`);
  for (const p of data.products) {
    await client.execute({
      sql: `INSERT INTO products (
              id, sku, name, slug, category_id, category_slug, category_name,
              short_description, description, specifications, price, discount_price,
              stock_quantity, is_available, is_featured, is_published,
              primary_image, images, meta_title, meta_description
            ) VALUES (
              ?, ?, ?, ?, ?, ?, ?,
              ?, ?, ?, ?, ?,
              ?, ?, ?, ?,
              ?, ?, ?, ?
            )
            ON CONFLICT(sku) DO NOTHING;`,
      args: [
        p.id, p.sku, p.name, p.slug, p.category_id || null, p.category_slug || null, p.category_name || null,
        p.short_description || null, p.description || null,
        typeof p.specifications === 'object' ? JSON.stringify(p.specifications) : (p.specifications || '{}'),
        p.price, p.discount_price || null,
        p.stock_quantity ?? 10, p.is_available ?? 1, p.is_featured ?? 0, p.is_published ?? 1,
        p.primary_image || null,
        typeof p.images === 'object' ? JSON.stringify(p.images) : (p.images || '[]'),
        p.meta_title || null, p.meta_description || null
      ]
    });
  }

  // Insert Settings
  console.log(`--- 5. Migrating ${data.settings.length} Settings ---`);
  for (const s of data.settings) {
    await client.execute({
      sql: `INSERT INTO store_settings (key, value)
            VALUES (?, ?)
            ON CONFLICT(key) DO UPDATE SET value = excluded.value;`,
      args: [s.key, s.value]
    });
  }

  // Insert Testimonials
  if (data.testimonials) {
    console.log(`--- 6. Migrating ${data.testimonials.length} Testimonials ---`);
    for (const t of data.testimonials) {
      await client.execute({
        sql: `INSERT INTO testimonials (customer_name, customer_location, rating, review_text, product_purchased, is_sample, is_published)
              VALUES (?, ?, ?, ?, ?, ?, ?);`,
        args: [t.customer_name, t.customer_location || null, t.rating || 5, t.review_text, t.product_purchased || null, t.is_sample ?? 0, t.is_published ?? 1]
      });
    }
  }

  // Insert FAQs
  if (data.faqs) {
    console.log(`--- 7. Migrating ${data.faqs.length} FAQs ---`);
    for (const f of data.faqs) {
      await client.execute({
        sql: `INSERT INTO faqs (question, answer, category, display_order, is_published)
              VALUES (?, ?, ?, ?, ?);`,
        args: [f.question, f.answer, f.category || 'General', f.display_order || 0, f.is_published ?? 1]
      });
    }
  }

  // Verify
  const prodRes = await client.execute('SELECT COUNT(*) as count FROM products');
  const catRes = await client.execute('SELECT COUNT(*) as count FROM categories');
  console.log(`\n======================================================`);
  console.log(`🎉 TURSO MIGRATION COMPLETE!`);
  console.log(`   Products in Turso: ${prodRes.rows[0].count}`);
  console.log(`   Categories in Turso: ${catRes.rows[0].count}`);
  console.log(`======================================================`);
}

migrate().catch(e => {
  console.error('Migration failed:', e);
  process.exit(1);
});
