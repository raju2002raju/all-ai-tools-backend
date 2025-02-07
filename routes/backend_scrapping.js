const express = require("express");
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

// Add stealth plugin to bypass detection
puppeteer.use(StealthPlugin());

const router = express.Router();

router.post("/scrape", async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  let browser = null;
  try {
    // Enhanced browser launch with social media optimization
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox', 
        '--disable-setuid-sandbox', 
        '--disable-gpu', 
        '--disable-dev-shm-usage',
        '--disable-web-security'
      ],
      timeout: 90000,
      defaultViewport: { width: 1920, height: 1080 }
    });

    const page = await browser.newPage();

    // Advanced user agent for social media platforms
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    );

    // Navigate with extended timeout
    await page.goto(url, {
      waitUntil: ['networkidle2', 'domcontentloaded'],
      timeout: 60000
    });

    // Comprehensive social media contact extraction
    const socialContactData = await page.evaluate(() => {
      // Advanced email extraction
      const extractEmails = () => {
        const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
        const emails = new Set();

        // Social media specific email extraction
        const socialSelectors = [
          'a[href^="mailto:"]',
          '.contact-email',
          '.email-link',
          '[data-email]',
          '[aria-label*="email"]',
          // Social platform specific selectors
          '[class*="contact-info"]',
          '[class*="team-member-email"]',
          '[class*="profile-email"]'
        ];

        // Collect emails from various sources
        socialSelectors.forEach(selector => {
          document.querySelectorAll(selector).forEach((el) => {
            const emailText = el.textContent || el.getAttribute('href') || el.getAttribute('data-email');
            const matches = emailText.match(emailRegex);
            if (matches) matches.forEach(email => emails.add(email));
          });
        });

        // Extract from page text
        const pageText = document.body.innerText;
        const regexEmails = pageText.match(emailRegex) || [];
        regexEmails.forEach((email) => emails.add(email));

        return [...emails];
      };

      // Advanced phone number extraction
      const extractPhoneNumbers = () => {
        const phoneRegex = /(\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
        const phones = new Set();

        const socialPhoneSelectors = [
          'a[href^="tel:"]',
          '.contact-phone',
          '.phone-number',
          '[data-phone]',
          '[aria-label*="phone"]',
          // Social platform specific selectors
          '[class*="contact-info"]',
          '[class*="team-member-phone"]',
          '[class*="profile-phone"]'
        ];

        // Collect phone numbers
        socialPhoneSelectors.forEach(selector => {
          document.querySelectorAll(selector).forEach((el) => {
            const phoneText = el.textContent || el.getAttribute('href') || el.getAttribute('data-phone');
            const matches = phoneText.match(phoneRegex);
            if (matches) matches.forEach(phone => phones.add(phone));
          });
        });

        // Extract from page text
        const pageText = document.body.innerText;
        const regexPhones = pageText.match(phoneRegex) || [];
        regexPhones.forEach((phone) => phones.add(phone));

        return [...phones];
      };

      // Advanced name extraction for team/company profiles
      const extractNames = () => {
        const namePatterns = [
          ...document.querySelectorAll('h1, h2, h3, .name, .contact-name, .team-member, .profile-name')
        ]
          .map((el) => el.innerText.trim())
          .filter(
            (text) =>
              text.split(" ").length >= 2 && 
              text.split(" ").length <= 4 && 
              !/\d/.test(text) // Exclude names with numbers
          );
        return [...new Set(namePatterns)];
      };

      // Extract social media profile links
      const extractSocialProfiles = () => {
        const socialLinks = {
          linkedin: [],
          twitter: [],
          facebook: [],
          instagram: []
        };

        const socialSelectors = [
          'a[href*="linkedin.com"]',
          'a[href*="twitter.com"]',
          'a[href*="facebook.com"]',
          'a[href*="instagram.com"]'
        ];

        socialSelectors.forEach(selector => {
          document.querySelectorAll(selector).forEach(link => {
            const href = link.getAttribute('href');
            if (href.includes('linkedin.com')) socialLinks.linkedin.push(href);
            if (href.includes('twitter.com')) socialLinks.twitter.push(href);
            if (href.includes('facebook.com')) socialLinks.facebook.push(href);
            if (href.includes('instagram.com')) socialLinks.instagram.push(href);
          });
        });

        return socialLinks;
      };

      // Comprehensive data return
      return {
        emails: extractEmails(),
        phoneNumbers: extractPhoneNumbers(),
        names: extractNames(),
        socialProfiles: extractSocialProfiles(),
        companyName: document.title || "",
        url: window.location.href
      };
    });

    // Additional fallback extraction
    const htmlContent = await page.content();
    
    // Merge and deduplicate results
    const fallbackEmails = htmlContent.match(
      /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g
    ) || [];
    const fallbackPhones = htmlContent.match(
      /(\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g
    ) || [];

    socialContactData.emails = [...new Set([...socialContactData.emails, ...fallbackEmails])];
    socialContactData.phoneNumbers = [...new Set([...socialContactData.phoneNumbers, ...fallbackPhones])];

    // Send response
    res.status(200).json(socialContactData);
  } catch (error) {
    console.error("Detailed Social Media Scraping Error:", error);
    res.status(500).json({
      error: "Failed to scrape social media contacts",
      details: error.message,
      stack: error.stack
    });
  } finally {
    // Ensure browser is closed
    if (browser) {
      await browser.close();
    }
  }
});

module.exports = router;