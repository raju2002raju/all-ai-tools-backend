const express = require('express');
const {WordChangerfunction} = require('../utilis/audio');
const router = express.Router();


router.post('/paragraph-rephrase', async (req, res) => {
    const {text} = req.body;

    try {
         const paragraphText = await WordChangerfunction(text);
         res.json({paragraphText});
    }catch (error) {
        console.log('Error' , error)
        res.status(500).json({error : 'Internal Server Error'})
    }
})

module.exports = router;