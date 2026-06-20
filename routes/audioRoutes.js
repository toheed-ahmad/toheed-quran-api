import express from 'express';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const AUDIO_DIR = path.join(__dirname, '../data/audio');

// Get Audio Stream URL or Metadata
router.get('/:reciter/:surahId', async (req, res) => {
    try {
        const { reciter, surahId } = req.params;
        const fileNumber = parseInt(surahId);

        if (isNaN(fileNumber) || fileNumber < 1 || fileNumber > 114) {
            return res.status(400).json({ error: "Invalid Surah ID. Must be between 1 and 114." });
        }

        const validReciters = ['abdulbasit', 'alafasy', 'maher', 'minshawi', 'sudais'];
        if (!validReciters.includes(reciter.toLowerCase())) {
            return res.status(400).json({ error: `Invalid reciter. Choose from: ${validReciters.join(', ')}` });
        }

        const formattedSurah = String(fileNumber).padStart(3, '0');
        
        // Return dynamic file info / streaming URLs
        // If you are storing MP3 files directly, you can redirect or serve the file metadata
        const audioPath = `/data/audio/${reciter}/${formattedSurah}.mp3`;

        return res.json({
            reciter: reciter,
            surah: fileNumber,
            audio_url: audioPath,
            info: `You can play or download this audio directly from the path.`
        });
    } catch (error) {
        return res.status(500).json({ error: "Failed to process audio request." });
    }
});

export default router;