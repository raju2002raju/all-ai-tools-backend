const express = require('express');
const { OnlineProofreaderChecker } = require('../utilis/audio');
const router = express.Router();

router.post('/online-proofreader', async (req, res) => {
    const { text } = req.body;

    try {
        const proofreaderCorrectedText = await OnlineProofreaderChecker(text);
        res.json({ proofreaderCorrectedText });
    } catch (error) {
        console.error('Error during conversion:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;    