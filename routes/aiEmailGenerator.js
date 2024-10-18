const express = require('express');
const router = express.Router();
const { OpenAI } = require('openai'); 

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY 
});

async function getChatCompletion(topic, selectedType) {
  try {
    
    let prompt;

    switch (selectedType) {
        case 'Email':
            prompt = `Generate a professional email with a clear subject line, greeting, body, and closing. Ensure proper formatting, grammar, and tone based on the context provided : ${topic}`
            break;
        case 'Title':
            prompt = `Generate 5 different types of titles for the topic '${topic}' in the following styles:

Descriptive Title: Clearly describes the content.
Question Title: Engages readers by posing a question.
How-To Title: Provides a solution or guide.
List Title: Numbers key points or ideas.
Creative/Engaging Title: Catches attention with creativity or intrigue."
This will give you a variety of titles suitable for different contexts, from informative to engaging and creative.`
            break;
        case 'Outline':
            prompt =`Generate a detailed outline for the topic '${topic}' with the following structure:

Introduction: Brief overview of the topic.
Main Sections: Break down key points, subtopics, or arguments.
Subsections: Provide supporting details or examples for each main section.
Conclusion: Summarize the main points and provide final insights or takeaways."
This prompt ensures that the generated outline is well-structured and comprehensive for any topic.`
            break;
        case 'Introduction':
            prompt = `Generate an engaging introduction for the topic '${topic}' that includes:

Hook: A compelling opening statement to grab the reader's attention.
Background Information: Brief context or relevant information about the topic.
Thesis Statement: A clear statement outlining the main point or argument of the piece.
Purpose: Explain why this topic is important or relevant to the audience."
This prompt will help create a well-rounded introduction that captures interest and sets the stage for the content that follows.`
            break;
        case 'Paragraph':
            prompt = `Generate a coherent paragraph on the topic '${topic}' that includes:

Topic Sentence: A clear statement that introduces the main idea of the paragraph.
Supporting Details: Provide facts, examples, or arguments that elaborate on the topic sentence.
Transitions: Use transitional phrases to connect ideas smoothly.
Concluding Sentence: A final statement that summarizes the key point or provides a concluding thought."
This prompt will help create a structured and informative paragraph on any given topic.`
            break;
        case 'Post':
            prompt = `Generate a post about '${topic}' that includes:

Attention-Grabbing Hook: A compelling opening sentence to draw readers in.
Main Content: Discuss key points, insights, or arguments related to the topic, ensuring clarity and engagement.
Visual Elements: Suggest relevant images, videos, or infographics that could enhance the post.
Call to Action: Encourage readers to comment, share, or take some action related to the content.
Hashtags: Include relevant hashtags to increase visibility if it's for social media."
This prompt will help create an engaging and informative post suitable for various platforms.`
            break;
        case 'Social Media':
            prompt = `Create a social media post about '${topic}' that includes:

Catchy Headline: A brief and engaging title or opening line.
Main Message: A clear and concise message that conveys the key point or idea.
Visual Suggestion: A description of an image or graphic that would complement the text.
Engagement Question: A question or call to action to encourage interaction from followers.
Hashtags: Include 3-5 relevant hashtags to increase reach and engagement."
This prompt will help create engaging and shareable content tailored for social media platforms.`
            break;
        case 'Ad':
            prompt = `Create an advertisement for '${topic}' that includes:

Attention-Grabbing Headline: A compelling and catchy headline that draws interest.
Key Features/Benefits: Highlight 3-5 main features or benefits of the product/service.
Target Audience: Specify who the advertisement is aimed at (e.g., age group, interests).
Call to Action: A clear instruction on what you want the audience to do (e.g., visit a website, make a purchase).
Visual Elements: Describe any imagery or design elements that should accompany the ad."
This prompt will help create an effective advertisement tailored to attract potential customers.`
            break;
        case 'Conclusion':
            prompt = `Generate a conclusion for the topic '${topic}' that includes:

Restatement of Thesis: Summarize the main argument or point made in the content.
Summary of Key Points: Briefly recap the essential points discussed in the piece.
Final Insights: Provide a final thought, reflection, or call to action that encourages further consideration or action from the reader.
Closing Statement: End with a strong closing sentence that leaves a lasting impression."
This prompt will help create a concise and impactful conclusion that effectively wraps up the content.`
            break;
        default:
            throw new Error('Invalid content type provided');

    }

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

router.post('/ai-email-generator', async (req, res) => {
  const { topic, selectedType } = req.body;

  if (!topic) {
    return res.status(400).json({ error: 'Essay topic is required' });
  }

  try {
    const aiEmail = await getChatCompletion(topic, selectedType);
    res.json({ aiEmail });
  } catch (error) {
    console.error('Error during title generation:', error);
    res.status(500).json({ error: 'Unable to generate titles at this time. Please try again later.' });
  }
});

module.exports = router;