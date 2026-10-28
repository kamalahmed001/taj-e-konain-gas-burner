import { createClient } from '@libsql/client';
import db from './db.js';
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const TURSO_DATABASE_URL = process.env.TURSO_DATABASE_URL || 'libsql://taj-e-konain-pashaax40.aws-ap-southeast-1.turso.io';
const TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN || 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3OTMyMjAzOTgsImlkIjoiMDFhMTg0NDEtZjcwMS03NDg2LTg5OTItNWQyMWQ3NjdhNTJiIiwia2lkIjoiVGRnTDJaVFd2WjdZZ050bF9Pd1Vka3VHU1lxVXpidGFQVEdXQjlsOE52MCIsInJpZCI6ImM3ZDIyOWYzLWRhNTktNDJlMC05OTA2LWZhYjhhNjkyYWYzMCJ9.vngSPqJet8OW8rprgeZfQNPxu8GVpoEswVpTd_YgBSVKBM6Zd_6dKfne1k9qH9_RzfoFa2c0pDuHNHTOgts8Bw';

let client = null;

if (TURSO_DATABASE_URL && TURSO_AUTH_TOKEN) {
  try {
    client = createClient({
      url: TURSO_DATABASE_URL,
      authToken: TURSO_AUTH_TOKEN
    });
    console.log('⚡ Turso Cloud Database connected at:', TURSO_DATABASE_URL);
  } catch (err) {
    console.warn('⚠️ Could not connect to Turso:', err.message);
  }
}

/**
 * Pull all data from Turso cloud into local store.db (called on boot/restart)
 */
export async function pullFromTurso() {
  if (!client) return false;
  try {
    console.log('🔄 Syncing local database with Turso cloud...');

    // 1. Categories
    const catRes = await client.execute('SELECT * FROM categories ORDER BY display_order ASC, id ASC');
    if (catRes.rows.length > 0) {
      db.exec('DELETE FROM categories;');
      const insertCat = db.prepare(`
        INSERT INTO categories (id, name, slug, description, image_url, display_order)
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      catRes.rows.forEach(c => {
        insertCat.run(c.id, c.name, c.slug, c.description || null, c.image_url || null, c.display_order || 0);
      });
    }

    // 2. Products
    const prodRes = await client.execute('SELECT * FROM products ORDER BY id ASC');
    if (prodRes.rows.length > 0) {
      db.exec('DELETE FROM products;');
      const insertProd = db.prepare(`
        INSERT INTO products (
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
      `);
      prodRes.rows.forEach(p => {
        insertProd.run(
          p.id, p.sku, p.name, p.slug, p.category_id || null, p.category_slug || null, p.category_name || null,
          p.short_description || null, p.description || null,
          typeof p.specifications === 'object' ? JSON.stringify(p.specifications) : (p.specifications || '{}'),
          p.price, p.discount_price || null,
          p.stock_quantity ?? 10, p.is_available ?? 1, p.is_featured ?? 0, p.is_published ?? 1,
          p.primary_image || null,
          typeof p.images === 'object' ? JSON.stringify(p.images) : (p.images || '[]'),
          p.meta_title || null, p.meta_description || null
        );
      });
    }

    // 3. Settings
    const setRes = await client.execute('SELECT key, value FROM store_settings');
    if (setRes.rows.length > 0) {
      const upsertSetting = db.prepare(`
        INSERT INTO store_settings (key, value, updated_at)
        VALUES (?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(key) DO UPDATE SET value=excluded.value, updated_at=CURRENT_TIMESTAMP
      `);
      setRes.rows.forEach(s => {
        upsertSetting.run(s.key, s.value);
      });
    }

    console.log(`✅ Synced with Turso cloud: ${prodRes.rows.length} products, ${catRes.rows.length} categories.`);
    return true;
  } catch (err) {
    console.warn('⚠️ Turso pull notice:', err.message);
    return false;
  }
}

/**
 * Execute a query or update directly on Turso cloud
 */
export async function executeTurso(sql, args = []) {
  if (!client) return null;
  try {
    return await client.execute({ sql, args });
  } catch (err) {
    console.warn('Turso execute error:', err.message);
    return null;
  }
}

/**
 * Sync all local tables up to Turso
 */
export async function pushFullStoreToTurso() {
  if (!client) return false;
  try {
    const products = db.prepare('SELECT * FROM products').all();
    const categories = db.prepare('SELECT * FROM categories').all();
    const settings = db.prepare('SELECT * FROM store_settings').all();

    // 1. Delete removed categories from Turso cloud
    const localCatIds = categories.map(c => c.id).filter(Boolean);
    if (localCatIds.length > 0) {
      await client.execute(`DELETE FROM categories WHERE id NOT IN (${localCatIds.join(',')})`);
    }

    // 2. Delete removed products from Turso cloud
    const localProdIds = products.map(p => p.id).filter(Boolean);
    if (localProdIds.length > 0) {
      await client.execute(`DELETE FROM products WHERE id NOT IN (${localProdIds.join(',')})`);
    }

    for (const c of categories) {
      await client.execute({
        sql: `INSERT INTO categories (id, name, slug, description, image_url, display_order)
              VALUES (?, ?, ?, ?, ?, ?)
              ON CONFLICT(slug) DO UPDATE SET
                name = excluded.name,
                description = excluded.description,
                image_url = excluded.image_url,
                display_order = excluded.display_order;`,
        args: [c.id, c.name, c.slug, c.description || null, c.image_url || null, c.display_order || 0]
      });
    }

    for (const p of products) {
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
              ON CONFLICT(sku) DO UPDATE SET
                name = excluded.name,
                slug = excluded.slug,
                category_id = excluded.category_id,
                category_slug = excluded.category_slug,
                category_name = excluded.category_name,
                short_description = excluded.short_description,
                description = excluded.description,
                specifications = excluded.specifications,
                price = excluded.price,
                discount_price = excluded.discount_price,
                stock_quantity = excluded.stock_quantity,
                is_available = excluded.is_available,
                is_featured = excluded.is_featured,
                is_published = excluded.is_published,
                primary_image = excluded.primary_image,
                images = excluded.images,
                meta_title = excluded.meta_title,
                meta_description = excluded.meta_description;`,
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

    for (const s of settings) {
      await client.execute({
        sql: `INSERT INTO store_settings (key, value)
              VALUES (?, ?)
              ON CONFLICT(key) DO UPDATE SET value = excluded.value;`,
        args: [s.key, s.value]
      });
    }

    console.log('✅ Pushed full store state to Turso cloud.');
    return true;
  } catch (err) {
    console.warn('Turso push error:', err.message);
    return false;
  }
}

export default client;
