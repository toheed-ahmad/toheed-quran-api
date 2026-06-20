import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TAFSIR_DIR = path.join(__dirname, '../data/tafsir');

// Dynamic Tafsir Endpoint
router.get('/:mufassir/:surahId', async (req, res) => {
    try {
        const { mufassir, surahId } = req.params;
        const fileNumber = parseInt(surahId);

        if (isNaN(fileNumber) || fileNumber < 1 || fileNumber > 114) {
            return res.status(400).json({ error: "Invalid Surah ID. Must be between 1 and 114." });
        }

        // Clean name to prevent directory traversal security issues
        const safeMufassirName = mufassir.replace(/[^a-zA-Z0-9_-]/g, '').toLowerCase();
        
        const possibleNames = [`${fileNumber}.json`, `${String(fileNumber).padStart(3, '0')}.json`];
        let fileContent = null;

        for (const name of possibleNames) {
            try {
                const filePath = path.join(TAFSIR_DIR, safeMufassirName, name);
                fileContent = await fs.readFile(filePath, 'utf-8');
                break;
            } catch (e) {
                continue;
            }
        }

        if (!fileContent) {
            return res.status(404).json({ 
                error: `Tafsir '${mufassir}' for Surah ${surahId} is not available yet.`,
                instruction: `To add this, place ${surahId}.json inside 'data/tafsir/${safeMufassirName}/'` 
            });
        }

        return res.json(JSON.parse(fileContent));
    } catch (error) {
        return res.status(500).json({ error: "Failed to fetch Tafsir data." });
    }
});

export default router;