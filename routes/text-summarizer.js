const express = require('express');
const {Summarizerfunction} = require('../utilis/audio');
const router = express.Router();


router.post('/text-summarizer', async (req, res) => {
    const {text} = req.body;

    try {
         const summarizerdata = await Summarizerfunction(text);
         res.json({summarizerdata});
    }catch (error) {
        console.log('Error' , error)
        res.status(500).json({error : 'Internal Server Error'})
    }
})

module.exports = router;