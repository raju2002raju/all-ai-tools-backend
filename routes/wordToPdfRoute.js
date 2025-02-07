const express = require("express");
const convertapi = require("convertapi")("secret_i8S3NYgZWK2BPQRQ"); // Replace with your ConvertAPI key
const fs = require("fs");
const path = require("path");

const router = express.Router();

// POST /api/word-to-pdf
router.post("/word-to-pdf", async (req, res) => {
  if (!req.files || !req.files.file) {
    return res.status(400).send("No file uploaded");
  }

  const wordFile = req.files.file;
  const uploadPath = path.join(__dirname, "..", "uploads", wordFile.name);

  try {
    // Save the uploaded Word file temporarily
    await wordFile.mv(uploadPath);

    // Convert the Word file to PDF using ConvertAPI
    const result = await convertapi.convert("pdf", { File: uploadPath });

    // Get the converted PDF file's download URL
    const pdfFile = result.files[0];

    if (pdfFile && pdfFile.url) {
      const pdfResponse = await fetch(pdfFile.url);
      const pdfBuffer = await pdfResponse.arrayBuffer();

      // Send the converted file
      res.setHeader("Content-Disposition", `attachment; filename=converted-file.pdf`);
      res.setHeader("Content-Type", "application/pdf");
      res.send(Buffer.from(pdfBuffer));
    } else {
      res.status(500).send("Failed to retrieve converted file.");
    }

    // Clean up temporary files
    fs.unlinkSync(uploadPath);
  } catch (error) {
    console.error("Conversion error:", error);
    res.status(500).send("File conversion failed");
  }
});

module.exports = router;
