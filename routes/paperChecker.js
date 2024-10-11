const express = require('express');
const {PaperCheckerfunction} = require('../utilis/audio');
const router = express.Router();

router.post('/paper-checker', async (req, res) => {
    const {text} = req.body;
    try {
        const PaperCorrectedText = await PaperCheckerfunction(text);
        res.json({PaperCorrectedText});

    } catch (error) {
        console.log('Error', error)
        throw new Error('Internal server error')
    }
})

module.exports = router;