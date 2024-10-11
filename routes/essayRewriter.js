const express = require('express');
const { EssayRewriterfunction } = require('../utilis/audio');
const router = express.Router();

router.post('/essay-rewrite', async (req, res) => {
    const { text } = req.body;

    try {
        const EssayRewriterText = await EssayRewriterfunction(text);
        res.json({ EssayRewriterText });
    } catch (error) {
        console.error('Error during conversion:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;    