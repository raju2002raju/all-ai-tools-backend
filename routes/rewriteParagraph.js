const express = require('express');
const { rewriteParagraph } = require('../utilis/audio');
const router = express.Router();

router.post('/rewrite-paragraph', async (req, res) => {
    const { text } = req.body;  // Ensure 'text' exists in the body

    if (!text) {
        return res.status(400).json({ error: 'Text is required' });  // Handle missing text
    }

    try {
        const rewriteparagraphText = await rewriteParagraph(text);
        res.json({ rewriteparagraphText });
    } catch (error) {
        console.error('Error during rewrite paragraph:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
