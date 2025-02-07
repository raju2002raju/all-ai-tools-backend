const express = require("express");
const fs = require("fs");
const axios = require("axios");
require("dotenv").config();

const router = express.Router();

router.post("/generate-audio", async (req, res) => {
  try {
    const { text, voice } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Text is required!" });
    }

    const response = await axios.post(
      "https://api.openai.com/v1/audio/speech",
      {
        model: "tts-1",
        input: text,
        voice: voice || "alloy", // Default voice: alloy
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        responseType: "arraybuffer",
      }
    );

    const audioPath = "output.mp3";
    fs.writeFileSync(audioPath, response.data);

    res.download(audioPath, "speech.mp3", () => {
      fs.unlinkSync(audioPath); // Delete file after download
    });
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to generate audio" });
  }
});

module.exports = router; 
