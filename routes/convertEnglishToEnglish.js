const express = require('express');
const { convertEnglish } = require('../utilis/audio');
const router = express.Router();

router.post('/convert-english-to-english', async (req, res) => {
    const { text, variant } = req.body;

    try {
        const convertedText = await convertEnglish(text, variant);
        res.json({ convertedText });
    } catch (error) {
        console.error('Error during conversion:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;