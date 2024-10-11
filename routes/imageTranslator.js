const express = require('express');
const {imageTranslaterfunction} = require('../utilis/audio');
const router = express.Router();


router.post('/translate', async (req, res) =>{
    const {text, targetLanguage} = req.body;

    try {
        const translatedText = await imageTranslaterfunction(text, targetLanguage);
        res.json({translatedText})
    }catch (error) {
        console.error('Error during conversion:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

module.exports = router;