const express = require("express");
const router = express.Router();
const axios = require("axios");


const fetchSearchResults = async (url, res) => {
    try {
        const response = await axios.get(url);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch data" });
    }
};

// Google Search Suggestions
router.get("/google", async (req, res) => {
    const query = req.query.q;
    fetchSearchResults(`https://suggestqueries.google.com/complete/search?client=firefox&q=${query}`, res);
});

// Yahoo Search Suggestions
router.get("/yahoo", async (req, res) => {
    const query = req.query.q;
    fetchSearchResults(`https://search.yahoo.com/sugg/gossip/gossip-us-ura/?output=fxjson&command=${query}`, res);
});

// Bing Search Suggestions
router.get("/bing", async (req, res) => {
    const query = req.query.q;
    fetchSearchResults(`https://api.bing.com/osjson.aspx?query=${query}`, res);
});

// YouTube Search Suggestions
router.get("/youtube", async (req, res) => {
    const query = req.query.q;
    fetchSearchResults(`https://suggestqueries.google.com/complete/search?client=firefox&ds=yt&q=${query}`, res);
});

// Amazon Search Suggestions (Unofficial)
router.get("/amazon", async (req, res) => {
    const query = req.query.q;
    fetchSearchResults(`https://completion.amazon.com/api/2017/suggestions?limit=10&prefix=${query}&mid=ATVPDKIKX0DER`, res);
});

module.exports = router;