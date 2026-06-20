import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TRANS_DIR = path.join(__dirname, '../data/translations');

// Available Translations Map
const languageMap = {
    'english_sahih': 'english_sahih',
    'hindi': 'hindi',
    'urdu_ahmad_ali': 'urdu_ahmad_ali',
    'urdu_junagarhi': 'urdu_junagarhi',
    'urdu_taqi': 'urdu_taqi'
};

router.get('/:language/:surahId', async (req, res) => {
    try {
        const { language, surahId } = req.params;
        const fileNumber = parseInt(surahId);

        if (isNaN(fileNumber) || fileNumber < 1 || fileNumber > 114) {
            return res.status(400).json({ error: "Invalid Surah ID. Must be between 1 and 114." });
        }

        const targetFolder = languageMap[language.toLowerCase()];
        if (!targetFolder) {
            return res.status(400).json({ error: `Translation not found. Available: ${Object.keys(languageMap).join(', ')}` });
        }

        const possibleNames = [`${fileNumber}.json`, `${String(fileNumber).padStart(3, '0')}.json`];
        let fileContent = null;

        for (const name of possibleNames) {
            try {
                const filePath = path.join(TRANS_DIR, targetFolder, name);
                fileContent = await fs.readFile(filePath, 'utf-8');
                break;
            } catch (e) {
                continue;
            }
        }

        if (!fileContent) {
            return res.status(404).json({ error: `Translation file for Surah ${surahId} not found.` });
        }

        return res.json(JSON.parse(fileContent));
    } catch (error) {
        return res.status(500).json({ error: "Failed to fetch translation data." });
    }
});

export default router;