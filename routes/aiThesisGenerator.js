const express = require('express');
const router = express.Router();
const { OpenAI } = require('openai'); 

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY 
});

async function getChatCompletion(topic) {
  try {
    
    const prompt = `You are an advanced AI thesis statement generator. Your task is to create a strong, clear, and specific thesis statement based on the given topic. Follow these instructions:

Use the following input to create your thesis statement:

Topic: ${topic}


Generate a thesis statement that:

Clearly states the main idea or argument related to the topic
Is specific and focused
Is debatable or arguable
Provides a roadmap for the main points to be discussed
Is concise, typically one to two sentences long


The thesis statement should:

Avoid vague language or generalizations
Use strong, precise verbs
Establish the purpose of the essay or research paper
Indicate the scope of the topic
Suggest the organization of ideas


Generate three different versions of the thesis statement to provide options:

A standard version
A more complex version that includes cause and effect or comparison
A version that takes a unique or controversial stance on the topic


Present each thesis statement on a separate line, preceded by a number and a period.
Do not include any additional commentary or explanations.

Output format:

[Standard thesis statement]
[Complex thesis statement]
[Unique/controversial thesis statement]

Please generate three thesis statements for the topic: ${topic}
Note: This prompt is designed to generate three distinct thesis statements based on the provided topic. The actual topic will be supplied by the user through the front-end interface. The output will be three numbered thesis statements, each offering a different approach to the topic.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }]
    });

    if (response.choices && response.choices.length > 0) {
      return {
        generated: response.choices[0].message.content
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

router.post('/thesis-statement-generator', async (req, res) => {
  const { topic } = req.body;

  if (!topic) {
    return res.status(400).json({ error: 'Essay topic is required' });
  }

  try {
    const thesisStatement = await getChatCompletion(topic);
    res.json({ thesisStatement });
  } catch (error) {
    console.error('Error during title generation:', error);
    res.status(500).json({ error: 'Unable to generate titles at this time. Please try again later.' });
  }
});

module.exports = router;