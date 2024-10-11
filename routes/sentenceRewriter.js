const express = require('express');
const { SentenceRewriterfunction } = require('../utilis/audio');
const router = express.Router();

router.post('/sentence-rewriter', async (req, res) => {
    const { text } = req.body;

    try {
        const sentenceText = await SentenceRewriterfunction(text);
        res.json({ sentenceText });
    } catch (error) {
        console.error('Error during conversion:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;    