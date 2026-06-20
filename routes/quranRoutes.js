import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '../data/arabic');

// Get Surah by ID (1 to 114)
router.get('/:surahId', async (req, res) => {
    try {
        const { surahId } = req.params;
        const fileNumber = parseInt(surahId);

        if (isNaN(fileNumber) || fileNumber < 1 || fileNumber > 114) {
            return res.status(400).json({ error: "Invalid Surah ID. Must be between 1 and 114." });
        }

        // Handling files names like '1.json' or '001.json' dynamically
        const possibleNames = [`${fileNumber}.json`, `${String(fileNumber).padStart(3, '0')}.json`];
        let fileContent = null;

        for (const name of possibleNames) {
            try {
                const filePath = path.join(DATA_DIR, name);
                fileContent = await fs.readFile(filePath, 'utf-8');
                break; 
            } catch (e) {
                continue;
            }
        }

        if (!fileContent) {
            return res.status(404).json({ error: `Surah ${surahId} file not found.` });
        }

        return res.json(JSON.parse(fileContent));
    } catch (error) {
        return res.status(500).json({ error: "Failed to fetch Arabic text.", details: error.message });
    }
});

export default router;