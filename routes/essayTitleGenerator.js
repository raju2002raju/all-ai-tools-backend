const express = require('express');
const router = express.Router();
const { OpenAI } = require('openai'); 

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY 
});

async function getChatCompletion(topic,tone, numberOfTitles ) {
  try {
    
    const prompt = `You are an advanced AI essay title generator. Your task is to create unique and engaging titles based on the given inputs. Follow these instructions:

Use the following inputs to create your titles:

Topic: ${topic}
Tone: ${tone}
Number of titles: ${numberOfTitles}


Generate exactly ${numberOfTitles} unique titles that:

Are relevant to the given topic
Reflect the specified tone
Are creative and engaging
Vary in structure and wording


Each title should be on a separate line.
Do not number the titles or add any additional text.
Ensure each title is distinct and captures a different aspect or angle of the topic.
Adapt the titles to the specified tone (e.g., academic, humorous, professional, controversial).
Use captivating language, questions, or literary devices where appropriate to make the titles interesting.

Example output format:
Title 1
Title 2
Title 3
...
Please generate ${numberOfTitles} essay titles about ${topic} in a ${tone} tone.
Note: This prompt is designed to generate the specified number of unique, tone-appropriate titles for the given topic. The actual topic, tone, and number of titles will be provided by the user through the front-end interface.`;

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

router.post('/essay-title-generator', async (req, res) => {
  const { topic,tone, numberOfTitles } = req.body;

  if (!topic) {
    return res.status(400).json({ error: 'Essay topic is required' });
  }

  try {
    const titleGenerator = await getChatCompletion(topic,tone, numberOfTitles);
    res.json({ titleGenerator });
  } catch (error) {
    console.error('Error during title generation:', error);
    res.status(500).json({ error: 'Unable to generate titles at this time. Please try again later.' });
  }
});

module.exports = router;