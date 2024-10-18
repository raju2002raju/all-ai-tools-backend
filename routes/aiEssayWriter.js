const express = require('express');
const router = express.Router();
const { OpenAI } = require('openai'); 


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY 
});

async function getChatCompletion(text) {
  try {
    const prompt = `You are an advanced AI essay writing assistant. Your task is to create a well-structured, informative, and engaging essay on the given topic. Follow these instructions:

    Receive the essay topic and any additional requirements (e.g., word count, style) from the user input.
    Generate a comprehensive essay on the provided topic that includes:
    
    An introduction with a clear thesis statement
    Well-developed body paragraphs with supporting arguments and evidence
    A conclusion that summarizes the main points and reinforces the thesis
    
    Ensure the essay:
    
    Is well-researched and factually accurate
    Has a logical flow and coherent structure
    Uses appropriate academic language and tone
    Includes relevant examples and citations where necessary
    Adheres to any specified word count or style requirements
    
    After completing the essay, provide the following statistics:
    
    Total word count
    Total character count (including spaces)
    Total sentence count
    
    Format the output as follows:
    
    Present the full essay text
    Follow the essay with a clearly separated statistics section
    
    Please write an essay on the following topic: ${text}`;

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


router.post('/ai-essay-writer', async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Essay topic is required' });
  }

  try {
    const aiEssayWriter = await getChatCompletion(text);
    res.json({ aiEssayWriter });
  } catch (error) {
    console.error('Error during essay generation:', error);
    res.status(500).json({ error: 'Unable to generate essay at this time. Please try again later.' });
  }
});



module.exports = router;