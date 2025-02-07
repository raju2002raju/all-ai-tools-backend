const express = require("express");
const axios = require("axios");
const { load } = require("cheerio");
const cors = require("cors");

const router = express.Router();

// Enable CORS (Allow frontend requests)
router.use(cors());

// router.get("/scrape", async (req, res) => {
//   const { url } = req.query;

//   if (!url) {
//     return res.status(400).json({ error: "❌ URL is required" });
//   }

//   try {
//     // Fetch the page data
//     const { data } = await axios.get(url, {
//       headers: { "User-Agent": "Mozilla/5.0" }, // Prevents bot detection
//     });

//     // Load HTML into Cheerio
//     const $ = load(data);
//     let links = new Set();

//     $("a").each((_, element) => {
//       let link = $(element).attr("href");

//       if (link && !link.startsWith("#") && !link.startsWith("javascript")) {
//         try {
//           if (!link.startsWith("http")) {
//             link = new URL(link, url).href; // Convert relative URLs to absolute
//           }
//           links.add(link);
//         } catch (err) {
//           console.error("❌ Invalid URL:", link, err.message);
//         }
//       }
//     });

//     res.json({ links: Array.from(links) });
//   } catch (error) {
//     console.error("🚨 Scraper Error:", error.message);
//     res.status(500).json({ error: "Failed to fetch the page", details: error.message });
//   }
// });

const generateXML = (links, lastmod, changefreq, priority) => {
    return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">\n` +
      links.map(link => `  <url>\n    <loc>${link}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`).join("\n") +
      `\n</urlset>`;
  };
  
  router.post("/sitemap", async (req, res) => {
    const { url, lastmod, changefreq, priority } = req.body;
    if (!url) return res.status(400).json({ error: "URL is required" });
  
    try {
      const { data } = await axios.get(url, {
        headers: { "User-Agent": "Mozilla/5.0" }
      });
  
      const $ = load(data);
      let links = new Set();
  
      $("a").each((_, element) => {
        let link = $(element).attr("href");
        if (link && !link.startsWith("#") && !link.startsWith("javascript")) {
          if (!link.startsWith("http")) {
            link = new URL(link, url).href;
          }
          links.add(link);
        }
      });
  
      const xmlSitemap = generateXML(Array.from(links), lastmod, changefreq, priority);
      res.header("Content-Type", "application/xml");
      res.send(xmlSitemap);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch page" });
    }
  });

module.exports = router;
