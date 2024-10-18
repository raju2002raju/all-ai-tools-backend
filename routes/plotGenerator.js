const express = require('express');
const router = express.Router();
const { OpenAI } = require('openai'); 

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY 
});

async function getChatCompletion(topic,storyType, creativity, length) {
  try {
    
    const prompt = `You are an advanced AI plot generator. Your task is to create a unique and engaging plot with a title based on the given inputs. Follow these instructions:

Use the following inputs to create your plot:

Topic: ${topic}
Story Type: ${storyType}
Creativity Level: ${creativity}
Length: ${length}


First, generate a captivating title that reflects the plot and style of the story.
Present the title in this format:
Title: [Your Generated Title]<br/><br/>
After the title, generate a plot that:

Is centered around the given topic
Aligns with the specified story type (e.g., classic, original)
Reflects the requested creativity level (e.g., standard, inspired)
Meets the length requirement:

Short: Minimum 300 words
Medium: Minimum 300 words, aim for 400+
Long: Minimum 450 words




Structure the plot with the following elements:

Setting
Main characters
Conflict or challenge
Rising action
Climax
Resolution


Present the plot in paragraph form, with each major element starting a new paragraph.
Ensure the narrative flows logically and engagingly from one element to the next.
Adapt the style and complexity of the plot to match the story type and creativity level.
Do not include any additional commentary, headings, or metadata in your response beyond the title and plot.

Please generate a ${length} plot with a title about ${topic} in a ${storyType} style with ${creativity} creativity.
Note: This prompt will generate a title followed by a plot that meets the specified criteria. The actual topic, story type, creativity level, and length will be provided by the user through the front-end interface. The output will begin with a title in the specified format, followed by a continuous narrative in paragraph form, with each paragraph representing a major element of the plot structure.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }]
    });

    if (response.choices && response.choices.length > 0) {
      return {
        generator: response.choices[0].message.content
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

router.post('/plot-generator', async (req, res) => {
  const { topic,storyType, creativity, length } = req.body;

  if (!topic) {
    return res.status(400).json({ error: 'Essay topic is required' });
  }

  try {
    const plotGeneratorContent = await getChatCompletion(topic,storyType, creativity, length);
    res.json({ plotGeneratorContent });
  } catch (error) {
    console.error('Error during title generation:', error);
    res.status(500).json({ error: 'Unable to generate titles at this time. Please try again later.' });
  }
});

module.exports = router;