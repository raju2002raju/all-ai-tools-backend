const express = require('express');
const router = express.Router();
const axios = require('axios');
const puppeteer = require('puppeteer');

router.post('/speedtest', async (req, res) => {
    try {
        const { url } = req.body;
        if (!url) {
            return res.status(400).json({ error: 'URL is required' });
        }

        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        
        // Enable performance metrics
        await page.setCacheEnabled(false);
        const client = await page.target().createCDPSession();
        await client.send('Network.enable');

        let startTime = Date.now();
        let resources = {
            images: [],
            stylesheets: [],
            scripts: []
        };
        let totalSize = 0;
        let largestObject = { url: '', size: 0 };
        let slowestObject = { url: '', time: 0 };

        // Track network requests
        page.on('response', async response => {
            const url = response.url();
            const resourceType = response.request().resourceType();
            const timing = response.timing();
            const headers = response.headers();
            let size = parseInt(headers['content-length'] || 0);
            const loadTime = timing ? timing.receiveHeadersEnd - timing.requestWillBeSent : 0;

            totalSize += size;

            if (size > largestObject.size) {
                largestObject = { url, size };
            }
            if (loadTime > slowestObject.time) {
                slowestObject = { url, time: loadTime };
            }

            switch (resourceType) {
                case 'image':
                    const dimensions = await page.evaluate((url) => {
                        const img = document.querySelector(`img[src="${url}"]`);
                        return img ? { width: img.naturalWidth, height: img.naturalHeight } : { width: 0, height: 0 };
                    }, url);
                    resources.images.push({
                        url,
                        width: dimensions.width,
                        height: dimensions.height,
                        size,
                        loadTime: loadTime / 1000
                    });
                    break;
                case 'stylesheet':
                    resources.stylesheets.push({
                        url,
                        size,
                        loadTime: loadTime / 1000
                    });
                    break;
                case 'script':
                    resources.scripts.push({
                        url,
                        size,
                        loadTime: loadTime / 1000
                    });
                    break;
            }
        });

        await page.goto(url, { waitUntil: 'networkidle0' });
        const loadTime = (Date.now() - startTime) / 1000;
        await browser.close();

        // Calculate speeds and estimated times
        const downloadSpeed = totalSize / loadTime;
        const sizeKB = totalSize / 1024;
        
        // Calculate estimated download times for different connections
        const estimatedTimes = [
            { speed: 14.4, time: sizeKB / (14.4 * 128) },
            { speed: 33.6, time: sizeKB / (33.6 * 128) },
            { speed: 56, time: sizeKB / (56 * 128) },
            { speed: 128, time: sizeKB / (128 * 128) },
            { speed: 400, time: sizeKB / (400 * 128) },
            { speed: 1500, time: sizeKB / (1500 * 128) },
            { speed: 4096, time: sizeKB / (4096 * 128) }
        ];

        res.json({
            domain: new URL(url).hostname,
            size: sizeKB.toFixed(4),
            loadTime: loadTime.toFixed(3),
            downloadSpeed: (downloadSpeed / 1024).toFixed(4),
            averageSpeed: (downloadSpeed / (1024 * 1024)).toFixed(4),
            estimatedTimes,
            largestObject,
            slowestObject: {
                url: slowestObject.url
            },
            totalStats: {
                time: loadTime.toFixed(4),
                size: totalSize,
                images: resources.images.length,
                stylesheets: resources.stylesheets.length,
                scripts: resources.scripts.length
            },
            resources
        });

    } catch (error) {
        console.error('Error testing page speed:', error);
        res.status(500).json({ error: 'Failed to test page speed' });
    }
});

module.exports = router;