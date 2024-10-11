const express = require('express');
const {EssayChecker} = require('../utilis/audio');
const router = express.Router();

router.post('/Eassy-checker', async (req, res) => {
    const {text} = req.body;
    try {
        const EssayCorrectedText = await EssayChecker(text);
        res.json({EssayCorrectedText});

    } catch (error) {
        console.log('Error', error)
        throw new Error('Internal server error')
    }
})

module.exports = router;