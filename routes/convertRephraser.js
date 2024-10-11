const express = require('express');
const { convertRephraser } = require('../utilis/audio');
const router = express.Router();

router.post('/rephraser', async (req, res) => {
    const { text} = req.body;

    try {
        const convertedText = await convertRephraser(text);
        res.json({ convertedText });
    } catch (error) {
        console.error('Error during conversion:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;