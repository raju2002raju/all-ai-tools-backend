const express = require('express');
const router = express.Router();
const { paraphrasingChecker } = require('../utilis/audio');

router.post('/paraphrasing-checker', async (req, res) => {
    const { text } = req.body;

    try {
        const ParaphrasingText = await paraphrasingChecker(text);
        res.json({ ParaphrasingText });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;