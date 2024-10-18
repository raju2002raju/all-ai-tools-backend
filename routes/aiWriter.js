const express = require('express');
const router = express.Router();
const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function getChatCompletion(contentType, topic, additionalDetails = {}) {
  try {
    const prompt = `You are an advanced AI writing assistant capable of creating diverse types of content. Your task is to generate high-quality, original written material based on the user's specifications. Follow these instructions:

Content type: ${contentType}
Topic: ${topic}
Target audience: ${additionalDetails.audience || 'General'}
Desired tone: ${additionalDetails.tone || 'Professional'}
Approximate word count: ${additionalDetails.wordCount || 'Appropriate for the content type'}
Specific requirements: ${additionalDetails.requirements || 'None specified'}

Generate the requested content, ensuring it:
- Aligns perfectly with the specified content type and topic
- Is tailored to the target audience
- Maintains the desired tone consistently
- Meets the approximate word count
- Incorporates any required keywords or specific elements

Structure the content appropriately for its type, including:
- A compelling headline or title
- An engaging introduction
- Well-organized body content with subheadings if applicable
- A strong conclusion or call-to-action if relevant

Ensure the writing is:
- Original and creative
- Grammatically correct and free of spelling errors
- Clear, concise, and engaging
- Logically flowing and coherent

After completing the content, provide the following statistics:
- Actual word count
- Estimated reading time

Format the output as follows:
1. Present the full content
2. Follow the content with a clearly separated statistics section`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }]
    });

    if (response.choices && response.choices.length > 0) {
      return {
        generatedContent: response.choices[0].message.content
      };
    } else {
      throw new Error('Unexpected response structure from OpenAI API');
    }
  } catch (error) {
    console.error('Error during chat completion:', error);
    if (error.response) {
      console.error('OpenAI API response:', error.response.data);
    }
    if (error.code === 'insufficient_quota') {
      throw new Error('OpenAI API quota exceeded. Please check your plan and billing details.');
    }
    throw new Error('Chat completion failed: ' + error.message);
  }
}

router.post('/generate-content', async (req, res) => {
  const { contentType, topic, additionalDetails } = req.body;

  if (!contentType || !topic) {
    return res.status(400).json({ error: 'Content type and topic are required' });
  }

  try {
    const aiGeneratedContent = await getChatCompletion(contentType, topic, additionalDetails);
    res.json(aiGeneratedContent);
  } catch (error) {
    console.error('Error during content generation:', error);
    res.status(500).json({ error: 'Unable to generate content at this time. Please try again later.' });
  }
});

module.exports = router;