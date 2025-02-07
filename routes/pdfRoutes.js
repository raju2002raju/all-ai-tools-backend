const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const fs = require('fs');

const router = express.Router();
const upload = multer({ 
  dest: 'uploads/',
  limits: { fileSize: 10 * 1024 * 1024 } 
});

router.post('/convert-pdf', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file uploaded' });
    }

    const pdfBuffer = fs.readFileSync(req.file.path);
    const pdfData = await pdfParse(pdfBuffer);

    const wordBuffer = Buffer.from(pdfData.text, 'utf-8');

    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition': 'attachment; filename=converted.docx'
    });

    res.send(wordBuffer);

    fs.unlinkSync(req.file.path);
  } catch (error) {
    console.error('Conversion error:', error);
    res.status(500).json({ error: 'PDF conversion failed' });
  }
});

module.exports = router;