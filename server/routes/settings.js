import express from 'express';
import db from '../database/db.js';
import { authenticateToken } from '../middleware/auth.js';
import { autoSaveSnapshot } from './backup.js';

const router = express.Router();

// GET /api/settings — Public read of store settings
router.get('/', (req, res) => {
  try {
    const rows = db.prepare('SELECT key, value FROM store_settings').all();
    const settings = {};
    rows.forEach(r => {
      settings[r.key] = r.value;
    });

    // Default fallbacks if not yet seeded
    if (!settings.whatsapp_number) settings.whatsapp_number = '923432833991';
    if (!settings.store_name) settings.store_name = 'Taj-e-Konain Gas Burner';
    if (!settings.phone_number) settings.phone_number = '03432833991';

    return res.json({ success: true, data: settings });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch store settings' });
  }
});

// PUT /api/settings — Admin protected: Update store settings
router.put('/', authenticateToken, (req, res) => {
  try {
    const updates = req.body; // e.g. { store_name: '...', whatsapp_number: '...' }

    if (!updates || typeof updates !== 'object') {
      return res.status(400).json({ success: false, message: 'Invalid settings payload.' });
    }

    const upsert = db.prepare(`
      INSERT INTO store_settings (key, value, updated_at)
      VALUES (?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(key) DO UPDATE SET
        value = excluded.value,
        updated_at = CURRENT_TIMESTAMP
    `);

    // Clean phone/WhatsApp number if provided
    for (const [key, val] of Object.entries(updates)) {
      let cleanVal = String(val);
      if (key === 'whatsapp_number') {
        // Strip out non-digits, leading plus or zeros
        cleanVal = cleanVal.replace(/[^0-9]/g, '');
        if (cleanVal.startsWith('0')) cleanVal = '92' + cleanVal.slice(1);
        if (!cleanVal.startsWith('92')) cleanVal = '92' + cleanVal;
      }
      upsert.run(key, cleanVal);
    }

    // Return updated settings
    const rows = db.prepare('SELECT key, value FROM store_settings').all();
    const updated = {};
    rows.forEach(r => { updated[r.key] = r.value; });

    autoSaveSnapshot();

    return res.json({
      success: true,
      message: 'Store settings updated successfully',
      data: updated
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    return res.status(500).json({ success: false, message: 'Failed to update store settings' });
  }
});

export default router;
