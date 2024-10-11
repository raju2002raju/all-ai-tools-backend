const express = require('express')
const {rewordingTool} = require('../utilis/audio');
const router = express.Router();


router.post('/rewording-tool', async (req, res) => {
    const {text} = req.body;

    try{
        const rewordingText = await rewordingTool(text);
        res.json({rewordingText});
    } catch (error) {
        console.log("Error", error) 
        res.status(500).json({error : 'Internal server Error'})
    }
})


module.exports = router;