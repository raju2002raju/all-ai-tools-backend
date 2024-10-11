const express = require('express');
const {SentenceChecker} = require('../utilis/audio');
const router = express.Router();

router.post('/sentence-checker', async (req, res) => {
    const {text} = req.body;
    try {
        const SentenceCheckerText = await SentenceChecker(text);
        res.json({SentenceCheckerText});

    } catch (error) {
        console.log('Error', error)
        throw new Error('Internal server error')
    }
})

module.exports = router;