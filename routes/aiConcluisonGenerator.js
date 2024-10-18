const express = require('express');
const router = express.Router();
const { OpenAI } = require('openai'); 

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY 
});

async function getChatCompletion(topic, tone, format) {
  try {
    
    const prompt = `You are an advanced AI conclusion generator. Your task is to create a strong and effective conclusion based on the given inputs. Follow these instructions:

Use the following inputs to create your conclusion:

Topic: ${topic}
Tone: ${tone}
Format: ${format}


Generate a conclusion that:

Effectively summarizes the main points related to the given topic
Reinforces the significance of the topic
Provides a sense of closure
Leaves a lasting impression on the reader
Matches the specified tone (e.g., formal, casual, persuasive, reflective)


Tailor the content to the requested format:

If format is "paragraph":

Write a cohesive paragraph of 4-6 sentences
Use smooth transitions between ideas


If format is "bulletPoints":

Create 3-5 concise bullet points
Start each point with a clear, action-oriented phrase
Ensure each point can stand alone while contributing to the overall conclusion




Regardless of format, include:

A restatement of the main idea or thesis (without exact repetition)
A summary of key points or arguments
A final thought, call to action, or future implication


Adapt the language and structure to match the specified tone while maintaining clarity and impact.
Do not introduce new information that wasn't part of the main discussion.
Keep the conclusion concise and focused, typically 100-150 words for paragraphs or 3-5 points for bullet format.
Do not include any additional commentary, explanations, or metadata beyond the conclusion content.

Please generate a conclusion about ${topic} in a ${tone} tone, presented in ${format} format.
Note: This prompt will generate a conclusion that matches the specified topic, tone, and format. The actual topic, tone, and format will be provided by the user through the front-end interface. The output will be either a cohesive paragraph or a set of bullet points, depending on the format specified, tailored to the given topic and tone.`;

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

router.post('/conclusion-generator', async (req, res) => {
  const { topic, tone, format } = req.body;

  if (!topic) {
    return res.status(400).json({ error: 'Essay topic is required' });
  }

  try {
    const aiConclusion = await getChatCompletion(topic, tone, format);
    res.json({ aiConclusion });
  } catch (error) {
    console.error('Error during title generation:', error);
    res.status(500).json({ error: 'Unable to generate titles at this time. Please try again later.' });
  }
});

module.exports = router;