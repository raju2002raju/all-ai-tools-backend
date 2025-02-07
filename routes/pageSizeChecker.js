const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const router = express.Router();

// Helper function to validate URL
const isValidUrl = (string) => {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
};

// Helper function to convert relative URL to absolute
const getAbsoluteUrl = (baseUrl, relativeUrl) => {
    try {
        return new URL(relativeUrl, baseUrl).href;
    } catch (error) {
        return null;
    }
};

router.get('/page-size-checker', async (req, res) => {
    const { url } = req.query;

    // Input validation
    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    if (!isValidUrl(url)) {
        return res.status(400).json({ error: 'Invalid URL format' });
    }

    try {
        // Set timeout and headers for main request
        const mainResponse = await axios.get(url, {
            timeout: 10000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
            maxContentLength: 50 * 1024 * 1024 // 50MB limit
        });

        let totalSize = Buffer.byteLength(mainResponse.data, 'utf8');
        const $ = cheerio.load(mainResponse.data);

        // Collect unique resource URLs
        const resourceUrls = new Set();
        
        // CSS files
        $('link[rel="stylesheet"]').each((_, el) => {
            const href = $(el).attr('href');
            if (href) resourceUrls.add(href);
        });

        // JavaScript files
        $('script[src]').each((_, el) => {
            const src = $(el).attr('src');
            if (src) resourceUrls.add(src);
        });

        // Images
        $('img[src]').each((_, el) => {
            const src = $(el).attr('src');
            if (src) resourceUrls.add(src);
        });

        // Process resources with concurrent requests
        const results = await Promise.allSettled(
            Array.from(resourceUrls).map(async (link) => {
                const absoluteUrl = getAbsoluteUrl(url, link);
                if (!absoluteUrl) return 0;

                try {
                    const response = await axios.get(absoluteUrl, {
                        responseType: 'arraybuffer',
                        timeout: 5000,
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                        },
                        maxContentLength: 10 * 1024 * 1024 // 10MB limit per resource
                    });
                    return response.data.length;
                } catch (error) {
                    console.error(`Failed to fetch resource: ${absoluteUrl}`, error.message);
                    return 0;
                }
            })
        );

        // Sum up all successful resource sizes
        const resourcesSize = results.reduce((total, result) => 
            total + (result.status === 'fulfilled' ? result.value : 0), 0);

        const totalSizeBytes = totalSize + resourcesSize;

        res.json({
            url,
            stats: {
                totalSizeBytes,
                totalSizeKB: (totalSizeBytes / 1024).toFixed(2),
                totalSizeMB: (totalSizeBytes / 1024 / 1024).toFixed(2),
                htmlSizeKB: (totalSize / 1024).toFixed(2),
                resourcesSizeKB: (resourcesSize / 1024).toFixed(2),
                resourceCount: resourceUrls.size,
                successfulFetches: results.filter(r => r.status === 'fulfilled').length,
                failedFetches: results.filter(r => r.status === 'rejected').length
            }
        });
    } catch (error) {
        console.error('Error fetching page size:', error.message);
        res.status(error.response?.status || 500).json({ 
            error: 'Unable to fetch page size', 
            message: error.message 
        });
    }
});

module.exports = router;