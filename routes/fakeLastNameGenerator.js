const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/fake-last-name-generator', async (req, res) => {
    try {
        const { country, gender, howMany } = req.body;

        console.log({
            country, gender, howMany
        });

        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-4',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a Fake Name Generator API. Generate only names in the requested format, and follow the specified language or country-based nuances.'
                    },
                    {
                        role: 'user',
                        content: `Generate ${howMany} fake ${gender} last names only for ${country}-speaking countries. Do not include numbers or extra information; only provide a clean list of names with their ${country} equivalents in brackets.`
                    }
                ],
                temperature: 0.7,
                max_tokens: 1000
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        // Process the response to ensure a clean list of names
        const names = response.data.choices[0].message.content.trim();
        res.json({ success: true, names });
    } catch (error) {
        console.error('Error fake name generator:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

module.exports = router;
