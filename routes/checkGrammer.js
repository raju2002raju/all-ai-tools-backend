const express = require('express');
const {checkGrammer} = require('../utilis/audio');
const router = express.Router();


router.post('/check-grammer', async (req, res) => {
    const {text} = req.body;

    try {
         const grammerCheck = await checkGrammer(text);
         res.json({grammerCheck});
    }catch (error) {
        console.log('Error' , error)
        res.status(500).json({error : 'Internal Server Error'})
    }
})

module.exports = router;