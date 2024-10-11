const express = require('express');
const {WordChangerfunction} = require('../utilis/audio');
const router = express.Router();


router.post('/word-changer', async (req, res) => {
    const {text} = req.body;

    try {
         const WordChangerCorrectedText = await WordChangerfunction(text);
         res.json({WordChangerCorrectedText});
    }catch (error) {
        console.log('Error' , error)
        res.status(500).json({error : 'Internal Server Error'})
    }
})

module.exports = router;