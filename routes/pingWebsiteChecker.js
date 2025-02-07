const express = require('express');
const axios = require('axios');
const router = express.Router();

// Array of URLs to ping
const urls = [
  "https://blogsearch.google.ae/ping/RPC2",
  "https://blogsearch.google.at/ping/RPC2",
  "https://blogsearch.google.be/ping/RPC2",
  "https://blogsearch.google.bg/ping/RPC2",
  "https://blogsearch.google.ca/ping/RPC2",
  "https://blogsearch.google.ch/ping/RPC2",
  "https://blogsearch.google.cl/ping/RPC2",
  "https://blogsearch.google.co.cr/ping/RPC2",
  "https://blogsearch.google.co.hu/ping/RPC2",
  "https://blogsearch.google.co.id/ping/RPC2",
  "https://blogsearch.google.co.il/ping/RPC2",
  "https://blogsearch.google.co.in/ping/RPC2",
  "https://blogsearch.google.co.jp/ping/RPC2",
  "https://blogsearch.google.co.ma/ping/RPC2",
  "https://blogsearch.google.co.nz/ping/RPC2",
  "https://blogsearch.google.co.th/ping/RPC2",
  "https://blogsearch.google.co.uk/ping/RPC2",
  "https://blogsearch.google.co.ve/ping/RPC2",
  "https://blogsearch.google.co.za/ping/RPC2",
  "https://blogsearch.google.com.ar/ping/RPC2",
  "https://blogsearch.google.com.au/ping/RPC2",
  "https://blogsearch.google.com.br/ping/RPC2",
  "https://blogsearch.google.com.co/ping/RPC2",
  "https://blogsearch.google.com.do/ping/RPC2",
  "https://blogsearch.google.com.mx/ping/RPC2",
  "https://blogsearch.google.com.my/ping/RPC2",
  "https://blogsearch.google.com.pe/ping/RPC2",
  "https://blogsearch.google.com.sa/ping/RPC2",
  "https://blogsearch.google.com.sg/ping/RPC2",
  "https://blogsearch.google.com.tr/ping/RPC2",
  "https://blogsearch.google.com.tw/ping/RPC2",
  "https://blogsearch.google.com.ua/ping/RPC2",
  "https://blogsearch.google.com.uy/ping/RPC2",
  "https://blogsearch.google.com.vn/ping/RPC2",
  "https://blogsearch.google.com/ping/RPC2",
  "https://blogsearch.google.de/ping/RPC2",
  "https://blogsearch.google.es/ping/RPC2",
  "https://blogsearch.google.fi/ping/RPC2",
  "https://blogsearch.google.fr/ping/RPC2",
  "https://blogsearch.google.gr/ping/RPC2",
  "https://blogsearch.google.hr/ping/RPC2",
  "https://blogsearch.google.ie/ping/RPC2",
  "https://blogsearch.google.it/ping/RPC2",
  "https://blogsearch.google.jp/ping/RPC2",
  "https://blogsearch.google.lt/ping/RPC2",
  "https://blogsearch.google.nl/ping/RPC2",
  "https://blogsearch.google.pl/ping/RPC2",
  "https://blogsearch.google.pt/ping/RPC2",
  "https://blogsearch.google.ro/ping/RPC2",
  "https://blogsearch.google.ru/ping/RPC2",
  "https://blogsearch.google.se/ping/RPC2",
  "https://blogsearch.google.sk/ping/RPC2",
  "https://blogsearch.google.us/ping/RPC2"
];

// Route to ping all URLs
router.get('/ping-websites', async (req, res) => {
  const results = [];

  for (const url of urls) {
    try {
      await axios.get(url);
      results.push({ url, status: "success" });
    } catch (error) {
      results.push({ url, status: "failed" });
    }
  }

  results.push({ message: "------ COMPLETED ------" });
  res.json(results);
});

module.exports = router;
