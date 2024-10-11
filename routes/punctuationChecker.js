const express = require('express')
const {PunctuationChecker} = require('../utilis/audio');
const router = express.Router();


router.post('/punctuation-checker', async (req, res) =>{
    const {text} = req.body;

    try {
        const punctuationTxt = await PunctuationChecker(text);
        res.json({punctuationTxt});
    } catch (error) {
        console.log("Error" , error)
    }
} )

module.exports = router;