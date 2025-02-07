const express = require('express');
const router = express.Router();
const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

const viewportConfig = {
    mobile: {
      width: 375,
      height: 667,
      deviceScaleFactor: 1,
      isMobile: true,
      hasTouch: true
    },
    desktop: {
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1,
      isMobile: false
    }
  };
  
  const screenshotsDir = path.join(__dirname, 'screenshots');
  (async () => {
    try {
      await fs.mkdir(screenshotsDir, { recursive: true });
    } catch (error) {
      console.error('Error creating screenshots directory:', error);
    }
  })();
  
  router.post('/screenshot', async (req, res) => {
    const { url, viewMode = 'desktop' } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }
  
    try {
      const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
  
      const page = await browser.newPage();
      
      // Set viewport based on selected mode
      await page.setViewport(viewportConfig[viewMode]);
  
      // Emulate mobile device if mobile view is selected
      if (viewMode === 'mobile') {
        await page.emulate({
          viewport: viewportConfig.mobile,
          userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1'
        });
      }
  
      await page.goto(url, {
        waitUntil: 'networkidle0',
        timeout: 30000,
      });
  
      const screenshotId = crypto.randomBytes(16).toString('hex');
      const fileName = `${screenshotId}.png`;
      const filePath = path.join(screenshotsDir, fileName);
  
      await page.screenshot({
        path: filePath,
        fullPage: true,
      });
  
      await browser.close();
  
      res.json({ 
        success: true, 
        screenshotId,
        message: 'Screenshot captured successfully' 
      });
  
    } catch (error) {
      console.error('Screenshot error:', error);
      res.status(500).json({ error: 'Failed to capture screenshot' });
    }
  });
// Serve screenshots
router.get('/screenshot/:id', async (req, res) => {
  const { id } = req.params;
  const filePath = path.join(screenshotsDir, `${id}.png`);

  try {
    await fs.access(filePath);
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', `attachment; filename=screenshot-${id}.png`);
    res.sendFile(filePath);
  } catch (error) {
    res.status(404).json({ error: 'Screenshot not found' });
  }
});

// Cleanup old screenshots (run every hour)
setInterval(async () => {
  try {
    const files = await fs.readdir(screenshotsDir);
    const now = Date.now();
    
    for (const file of files) {
      const filePath = path.join(screenshotsDir, file);
      const stats = await fs.stat(filePath);
      
      // Delete files older than 1 hour
      if (now - stats.mtime.getTime() > 3600000) {
        await fs.unlink(filePath);
      }
    }
  } catch (error) {
    console.error('Cleanup error:', error);
  }
}, 3600000);


  module.exports = router;