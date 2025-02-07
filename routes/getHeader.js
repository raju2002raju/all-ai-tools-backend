const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

router.get('/get-header', async (req, res) => {
        const {url} = req.query;

        if(!url)  return res.status(400).json({error : 'URL is Required'})

            try {
                const response = await fetch(url, {method : 'HEAD'});
                const headers = Object.fromEntries(response.headers.entries());
                res.json(headers);
                
            } catch {
                res.status(500).json({error : 'Failed to fetch Header'})
            }
})


module.exports = router;