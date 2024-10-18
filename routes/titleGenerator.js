const express = require('express');
const router = express.Router();
const { OpenAI } = require('openai'); 

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY 
});

async function getChatCompletion(text, labels) {
  try {
    const categoriesPrompt = labels.map(cat => `${cat}:\n"[Insert ${cat} title here]"\n"[Insert another ${cat} title here]"`).join('\n');
    
    const prompt = `Generate titles for Facebook in the following formats: ${labels.join(' and ')}.

Example Output:
${categoriesPrompt}
You can use this prompt and structure to generate similar content for other topics as well! ${text}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }]
    });

    if (response.choices && response.choices.length > 0) {
      return {
        titles: response.choices[0].message.content
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

router.post('/title-generator', async (req, res) => {
  const { text, labels } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Essay topic is required' });
  }

  if (!labels || !Array.isArray(labels) || labels.length === 0) {
    return res.status(400).json({ error: 'At least one category is required' });
  }

  try {
    const titleGenerator = await getChatCompletion(text, labels);
    res.json({ titleGenerator });
  } catch (error) {
    console.error('Error during title generation:', error);
    res.status(500).json({ error: 'Unable to generate titles at this time. Please try again later.' });
  }
});

module.exports = router;