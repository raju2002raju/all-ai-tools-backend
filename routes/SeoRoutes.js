const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const router = express.Router();

// Utility function to validate URL
const isValidUrl = (url) => {   
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
};

// Function to analyze SEO factors
const analyzePage = ($, url) => {
    const issues = [];
    const warnings = [];
    const passed = [];
    
    // Analyze meta description
    const metaDesc = $('meta[name="description"]').attr('content');
    if (!metaDesc) {
        issues.push("Missing meta description");
    } else if (metaDesc.length < 120 || metaDesc.length > 160) {
        warnings.push("Meta description length should be between 120-160 characters");
    } else {
        passed.push("Meta description has optimal length");
    }

    // Analyze title
    const title = $('title').text();
    if (!title) {
        issues.push("Missing page title");
    } else if (title.length < 30 || title.length > 60) {
        warnings.push("Title length should be between 30-60 characters");
    } else {
        passed.push("Title has optimal length");
    }

    // Analyze headings
    const h1Count = $('h1').length;
    if (h1Count === 0) {
        issues.push("Missing H1 heading");
    } else if (h1Count > 1) {
        warnings.push("Multiple H1 headings found");
    } else {
        passed.push("H1 heading structure is correct");
    }

    // Analyze images
    const imagesWithoutAlt = $('img:not([alt])').length;
    if (imagesWithoutAlt > 0) {
        issues.push(`${imagesWithoutAlt} images missing alt text`);
    } else {
        passed.push("All images have alt text");
    }

    // Check content length
    const wordCount = $('body').text().trim().split(/\s+/).length;
    if (wordCount < 300) {
        warnings.push("Content length is too short (less than 300 words)");
    } else {
        passed.push("Content length is sufficient");
    }

    return {
        errors: issues.length,
        warnings: warnings.length,
        passed: passed.length,
        issuesList: issues,
        warningsList: warnings,
        passedList: passed,
        status: issues.length === 0 ? "Good" : "Needs Improvement",
        socialShares: 0,
        utf8: "Strict"
    };
};

router.post('/check-seo', async (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: "URL is required" });
    }

    if (!isValidUrl(url)) {
        return res.status(400).json({ error: "Invalid URL format" });
    }

    try {
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; SEOChecker/1.0;)'
            }
        });

        const $ = cheerio.load(response.data);
        const analysis = analyzePage($, url);

        // Calculate score based on issues and warnings
        const baseScore = 100;
        const scorePerIssue = 10;
        const scorePerWarning = 5;
        const score = Math.max(0, baseScore - 
            (analysis.errors * scorePerIssue) - 
            (analysis.warnings * scorePerWarning));

        const metaData = {
            title: $('title').text(),
            description: $('meta[name="description"]').attr('content'),
            ogTags: {
                title: $('meta[property="og:title"]').attr('content'),
                description: $('meta[property="og:description"]').attr('content'),
                image: $('meta[property="og:image"]').attr('content')
            }
        };

        const contentAnalysis = {
            h1Count: $('h1').length,
            h2Count: $('h2').length,
            imgCount: $('img').length,
            imgWithoutAlt: $('img:not([alt])').length,
            wordCount: $('body').text().trim().split(/\s+/).length
        };

        res.json({
            url,
            score,
            analysis,
            metaData,
            contentAnalysis,
            message: "SEO analysis completed successfully"
        });

    } catch (error) {
        console.error("Error analyzing SEO:", error.message);
        res.status(500).json({ 
            error: "Failed to analyze SEO",
            details: error.message 
        });
    }
});

module.exports = router;