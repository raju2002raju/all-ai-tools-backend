const express = require('express');
const fs = require('fs');
const { PDFDocument } = require('pdf-lib');
const path = require('path');

const router = express.Router();

// Ensure the compressed directory exists
const compressedDir = path.join(__dirname, '../compressed');
if (!fs.existsSync(compressedDir)) {
    fs.mkdirSync(compressedDir);
}

router.post('/compress', async (req, res) => {
    if (!req.files || !req.files.pdf) {
        return res.status(400).send('No file uploaded');
    }

    const pdfFile = req.files.pdf;

    try {
        const existingPdfBytes = pdfFile.data;
        const pdfDoc = await PDFDocument.load(existingPdfBytes);

        // Here, we'll just save the PDF directly for simplicity
        const compressedPdfBytes = await pdfDoc.save();

        // Create a path for the compressed PDF
        const compressedPath = path.join(compressedDir, pdfFile.name);

        // Write the compressed PDF to the disk
        fs.writeFileSync(compressedPath, compressedPdfBytes);

        // Respond with the compressed PDF file for download
        res.download(compressedPath, () => {
            fs.unlinkSync(compressedPath); // Clean up the compressed file after download
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Compression failed: ' + error.message);
    }
});

module.exports = router;