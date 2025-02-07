const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const router = express.Router();

router.get('/meta-analyzer', async (req, res) => {
  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    let response;
    try {
      response = await axios.get(url, {
        timeout: 5000, // 5 seconds timeout
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
    } catch (axiosError) {
      console.error('Axios error:', axiosError.message);
      return res.status(500).json({ 
        error: 'Failed to fetch the URL', 
        details: axiosError.message 
      });
    }

    const html = response.data;
    const $ = cheerio.load(html);

    const metaData = {
      title: $('title').text() || $('meta[property="og:title"]').attr('content'),
      description: $('meta[name="description"]').attr('content'),
      keywords: $('meta[name="keywords"]').attr('content'),
      
      // Open Graph
      ogTitle: $('meta[property="og:title"]').attr('content'),
      ogDescription: $('meta[property="og:description"]').attr('content'),
      ogImage: $('meta[property="og:image"]').attr('content'),
      
      // Twitter Card
      twitterCard: $('meta[name="twitter:card"]').attr('content'),
      twitterTitle: $('meta[name="twitter:title"]').attr('content'),
      twitterDescription: $('meta[name="twitter:description"]').attr('content'),
      
      // Technical
      canonical: $('link[rel="canonical"]').attr('href'),
      robots: $('meta[name="robots"]').attr('content'),
      viewport: $('meta[name="viewport"]').attr('content'),
      charset: $('meta[charset]').attr('charset'),
      language: $('html').attr('lang'),
    };

    res.json(metaData);
  } catch (error) {
    console.error('Error analyzing meta tags:', error);
    res.status(500).json({ 
      error: 'Failed to analyze meta tags',
      details: error.message
    });
  }
});

module.exports = router;