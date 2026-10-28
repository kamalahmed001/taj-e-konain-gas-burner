import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import categoryRoutes from './routes/categories.js';
import testimonialRoutes from './routes/testimonials.js';
import settingRoutes from './routes/settings.js';
import contentRoutes from './routes/content.js';
import contactRoutes from './routes/contact.js';
import uploadRoutes from './routes/upload.js';
import statsRoutes from './routes/stats.js';
import seoRoutes from './routes/seo.js';
import backupRoutes, { restoreFromBackupData } from './routes/backup.js';
import db from './database/db.js';
import { pullFromTurso } from './database/turso.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Ensure uploads folder exists
const uploadsDir = path.resolve(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware
app.use(cors({
  origin: true, // Allow frontend dev server and production
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static file serving for uploads
app.use('/uploads', express.static(uploadsDir));

// SEO and Robots routes at root
app.use('/', seoRoutes);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/backup', backupRoutes);

// Auto-restore from snapshot.json if store.db is empty
const snapshotPath = path.resolve(__dirname, 'database/snapshot.json');
if (fs.existsSync(snapshotPath)) {
  try {
    const raw = fs.readFileSync(snapshotPath, 'utf-8');
    const parsed = JSON.parse(raw);
    const prodCount = db.prepare('SELECT COUNT(*) as count FROM products').get().count;
    if (prodCount === 0 && parsed.data?.products?.length > 0) {
      console.log('Restoring catalog from snapshot.json...');
      restoreFromBackupData(parsed);
      console.log('Successfully restored catalog from snapshot.json');
    }
  } catch (err) {
    console.warn('Could not restore from snapshot:', err.message);
  }
}

// Pull latest products, categories, and settings from Turso cloud on boot
pullFromTurso().then((synced) => {
  if (synced) console.log('✅ Synchronized database with Turso cloud.');
}).catch((e) => console.warn('Turso initial pull notice:', e.message));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    store: 'Taj-e-Konain Gas Burner API',
    time: new Date().toISOString()
  });
});

// Serve frontend production build if present in client/dist
const clientDistPath = path.resolve(__dirname, '../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res) => {
    // Only catch non-API routes
    if (!req.path.startsWith('/api/') && !req.path.startsWith('/uploads/')) {
      res.sendFile(path.join(clientDistPath, 'index.html'));
    }
  });
}

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'An unexpected server error occurred.'
  });
});

// Start listening
const server = app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`  🔥 Taj-e-Konain Gas Burner Server Running on Port ${PORT}`);
  console.log(`  🌐 API Base URL: http://localhost:${PORT}/api`);
  console.log(`  📦 Uploads Directory: ${uploadsDir}`);
  console.log(`  🗺️ Sitemap: http://localhost:${PORT}/sitemap.xml`);
  console.log(`=======================================================`);
});

export default app;
