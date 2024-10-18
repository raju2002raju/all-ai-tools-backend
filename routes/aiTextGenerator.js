const express = require('express');
const router = express.Router();
const { OpenAI } = require('openai'); 

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY 
});

async function getChatCompletion(contentType, topic) {
    try {
      let prompt;
      switch (contentType) {
        case 'Headline/Title':
          prompt = `"Generate 5 titles that include ${topic} and highlight how it is impacting or revolutionizing the [related field/industry] in English."`;
          break;
        case 'Outline':
          prompt = `"Generate an outline for ${topic} that covers its history, key features, impact, challenges, and future developments."`;
          break;
        case 'Introduction':
          prompt = `"Generate an introduction for ${topic} that includes its founding details, growth, key features, impact on society, and any challenges it faces."`;
          break;
        case 'Post/Blog Post':
          prompt = `"Generate a blog post about ${topic} that includes its history, key features, societal impact, challenges, and future developments."`;
          break;
        case 'Social Media Post':
          prompt = `"Generate a concise and engaging social media post about ${topic} that highlights its key features or benefits, includes a call to action, and is suitable for platforms like Facebook, Twitter, or Instagram."`;
          break;
        case 'Ad Copy':
          prompt = `"Generate compelling ad copy for ${topic} that highlights its key features, benefits, and unique selling points, and includes a strong call to action."`;
          break;
        case 'Email':
          prompt = `"Generate an email for ${topic} that includes a friendly greeting, a clear and concise message outlining the main points, and a polite closing."`;
          break;
        case 'Conclusion':
          prompt = `"Generate a conclusion for ${topic} that summarizes the key points discussed, reinforces the main message, and provides a final thought or call to action."`;
          break;
        default:
          throw new Error('Invalid content type provided');
      }
  
      // Make API call using the selected prompt
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }]
      });
  
      if (response.choices && response.choices.length > 0) {
        return {
          content: response.choices[0].message.content
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
  

router.post('/ai-text-generator', async (req, res) => {
  const { contentType, topic } = req.body;

  if (!topic) {
    return res.status(400).json({ error: 'Topic is required' });
  }

  try {
    const generatedContent = await getChatCompletion(contentType, topic);
    res.json({ generatedContent });
  } catch (error) {
    console.error('Error during content generation:', error);
    res.status(500).json({ error: 'Unable to generate content at this time. Please try again later.' });
  }
});

module.exports = router;
