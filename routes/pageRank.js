const express = require("express");
const axios = require("axios");

const router = express.Router();


router.post("/get-pagerank", async (req, res) => {
    const { url } = req.body;
    const  apiKey = process.env.PAGE_RANK_APIKEY
    if (!url) {
        return res.status(400).json({ error: "URL is required" });
    }

    try {
        const response = await axios.get(
            `https://openpagerank.com/api/v1.0/getPageRank?domains[]=${url}`,
            {
                headers: { "API-OPR": apiKey }
            }
        );

        const pageRankData = response.data.response[0];
        res.json({
            domain: pageRankData.domain,
            pageRankDecimal: pageRankData.page_rank_decimal,
            pageRankInteger : pageRankData.page_rank_integer,
            rank : pageRankData.rank
        });

    } catch (error) {
        res.status(500).json({ error: "Error fetching PageRank", details: error.message });
    }
});

module.exports = router;
