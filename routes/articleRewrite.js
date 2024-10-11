const express = require('express');
const { articleRewrite } = require('../utilis/audio');
const router = express.Router();

router.post('/article-rewrite', async (req, res) => {
    const { text } = req.body;

    try {
        const newArticle = await articleRewrite(text);
        res.json({ newArticle });
    } catch (error) {
        console.error('Error during conversion:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;    