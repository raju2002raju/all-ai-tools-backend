const express = require('express');
const {parappharseGeneratorfunction} = require('../utilis/audio');
const router = express.Router();


router.post('/paraphrase-generator', async (req, res) => {
    const {text} = req.body;

    try {
         const paraphraseText = await parappharseGeneratorfunction(text);
         res.json({paraphraseText});
    }catch (error) {
        console.log('Error' , error)
        res.status(500).json({error : 'Internal Server Error'})
    }
})

module.exports = router;