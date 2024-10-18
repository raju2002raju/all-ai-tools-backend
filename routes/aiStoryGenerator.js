const express = require('express');
const router = express.Router();
const { OpenAI } = require('openai'); 

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY 
});

async function getChatCompletion(topic) {
  try {
    
    const prompt = `You are an advanced AI story generator. Your task is to create an engaging and creative short story based on the given topic. Follow these instructions:

Use the following input to create your story:

Topic: ${topic}


Generate a short story that:

Is centered around the given topic
Has a clear beginning, middle, and end
Includes vivid characters and descriptive settings
Contains an interesting plot with conflict and resolution
Is approximately 500-750 words long


Structure the story with the following elements:

An attention-grabbing opening paragraph
Character introduction and development
Setting description
Rising action and conflict
Climax
Resolution and conclusion


Begin the story with a title that relates to the topic and story content:
Title: [Your Generated Title]<br><br>
Present the story in paragraph form, with each major story element starting a new paragraph.
Use descriptive language, dialogue, and narrative techniques to make the story engaging.
Ensure the story flows logically and maintains reader interest throughout.
Adapt the style, tone, and complexity of the story to best suit the given topic.
Do not include any additional commentary, explanations, or metadata beyond the title and story content.

Please generate a short story based on the topic: ${topic}
Note: This prompt will generate a title followed by a short story that revolves around the specified topic. The actual topic will be provided by the user through the front-end interface. The output will begin with a title in the specified format, followed by a creative short story in paragraph form, incorporating all the essential elements of storytelling.`;

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

router.post('/ai-story-generator', async (req, res) => {
  const { topic } = req.body;

  if (!topic) {
    return res.status(400).json({ error: 'Essay topic is required' });
  }

  try {
    const aiStory = await getChatCompletion(topic);
    res.json({ aiStory });
  } catch (error) {
    console.error('Error during title generation:', error);
    res.status(500).json({ error: 'Unable to generate titles at this time. Please try again later.' });
  }
});

module.exports = router;