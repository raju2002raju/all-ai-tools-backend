const express = require('express');
const router = express.Router();
const { OpenAI } = require('openai'); 


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY 
});

async function getChatCompletion(text, paragraph, tone, length) {
    console.log('para', paragraph)
    console.log('tone', tone)
    console.log('text', text)
    console.log('length', length)
  try {
    const prompt = `You are an AI writing assistant. Your task is to generate paragraphs based on the given inputs. Follow these instructions:

Use the following inputs to create your content:

Topic: ${text}
Number of paragraphs: ${length}
Tone: ${tone}
Approximate words per paragraph: ${paragraph}


If any input is missing or invalid, use reasonable defaults without mentioning it.
Generate the paragraphs that:

Focus on the given topic
Maintain the specified tone
Contain approximately the requested number of words each


Ensure the paragraphs flow logically and use appropriate transitions.
Present the content as a continuous piece of writing without numbering, bullet points, or any additional commentary.

Example format:
1\n[First paragraph content]
2\n[Second paragraph content]
3\n[Third paragraph content]

`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }]
    });

    if (response.choices && response.choices.length > 0) {
      return {
        essay: response.choices[0].message.content
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


router.post('/paragraph-generator', async (req, res) => {
  const { text,tone, length, paragraphs } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Essay topic is required' });
  }

  try {
    const aiEssayWriter = await getChatCompletion(text, tone, length, paragraphs);
    res.json({ aiEssayWriter });
  } catch (error) {
    console.error('Error during essay generation:', error);
    res.status(500).json({ error: 'Unable to generate essay at this time. Please try again later.' });
  }
});



module.exports = router;