import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const META_DIR = path.join(__dirname, '../data/meta');

// 1. تمام سورتوں کی لسٹ حاصل کرنے کا اینڈپوائنٹ (Surah List)
router.get('/surahs', async (req, res) => {
    try {
        const filePath = path.join(META_DIR, 'surah_list.json');
        const fileContent = await fs.readFile(filePath, 'utf-8');
        return res.json(JSON.parse(fileContent));
    } catch (error) {
        return res.status(500).json({ error: "Failed to fetch surah list.", details: error.message });
    }
});

// 2. تمام پاروں کی لسٹ حاصل کرنے کا اینڈپوائنٹ (Juz List)
router.get('/juz', async (req, res) => {
    try {
        const filePath = path.join(META_DIR, 'juz_list.json');
        const fileContent = await fs.readFile(filePath, 'utf-8');
        return res.json(JSON.parse(fileContent));
    } catch (error) {
        return res.status(500).json({ error: "Failed to fetch juz list.", details: error.message });
    }
});

export default router;