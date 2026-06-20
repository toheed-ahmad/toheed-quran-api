import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Routes Import
import quranRoutes from './routes/quranRoutes.js';
import audioRoutes from './routes/audioRoutes.js';
import translationRoutes from './routes/translationRoutes.js';
import tafsirRoutes from './routes/tafsirRoutes.js';
import metaRoutes from './routes/metaRoutes.js'; // 👈 نیا راؤٹ امپورٹ کیا

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Static folders
app.use('/data', express.static(path.join(__dirname, 'data')));

// API Routes Base
app.use('/api/quran', quranRoutes);
app.use('/api/audio', audioRoutes);
app.use('/api/translations', translationRoutes);
app.use('/api/tafsir', tafsirRoutes);
app.use('/api/meta', metaRoutes); // 👈 نیا میٹا اینڈپوائنٹ بیس راستہ لنک کیا

// Root Endpoint
app.get('/', (req, res) => {
    res.json({
        message: "Welcome to Toheed Quran API",
        status: "Active",
        endpoints: {
            surah_list: "/api/meta/surahs", // 👈 لسٹ دیکھنے کے لیے
            juz_list: "/api/meta/juz",       // 👈 پاروں کی لسٹ کے لیے
            arabic: "/api/quran/:surahId",
            audio: "/api/audio/:reciter/:surahId",
            translations: "/api/translations/:language/:surahId",
            tafsir: "/api/tafsir/:mufassir/:surahId"
        }
    });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong on the server!' });
});

app.listen(PORT, () => {
    console.log(`🚀 Server is running smoothly on http://localhost:${PORT}`);
});