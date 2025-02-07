const express = require("express");
const fetch = require("node-fetch"); // Import node-fetch
const convertapi = require("convertapi")("secret_i8S3NYgZWK2BPQRQ"); // Replace with your key
const fs = require("fs");
const path = require("path");

const router = express.Router();

router.post("/convert", async (req, res) => {
  if (!req.files || !req.files.file) {
    return res.status(400).send("No file uploaded");    
  }

  const pptFile = req.files.file;
  const uploadPath = path.join(__dirname, "..", "uploads", pptFile.name);

  try {
    // Save the uploaded PPT file temporarily
    await pptFile.mv(uploadPath);

    // Convert the PPT file to PDF using ConvertAPI
    const result = await convertapi.convert("pdf", { File: uploadPath });

    // Get the converted PDF file's download URL
    const pdfFile = result.files[0]; // The first file in the array is the converted PDF

    if (pdfFile && pdfFile.url) {
      const pdfResponse = await fetch(pdfFile.url);
      const pdfBuffer = await pdfResponse.arrayBuffer(); // Use arrayBuffer() for binary data

      // Send the file to the client
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
