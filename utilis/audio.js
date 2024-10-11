const axios = require('axios');
const OpenAI = require('openai');
require('dotenv').config();


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, 
});

async function getChatCompletion(text) {
  try {
    const prompt = `In the following text, find any misspelled words, correct them, and wrap the corrected words in <b> tags. Return only the corrected text with the corrected words in <b> tags. Text: ${text}

Example:
Input: "gud mornin"
Output: "<b>good</b> <b>morning</b>"

Input: "The cat jumpd ovr the fence"
Output: "The cat <b>jumped</b> <b>over</b> the fence"`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }]
    });

    if (response.choices && response.choices.length > 0) {
      return {
        correctedText: response.choices[0].message.content
      };
    } else {
      throw new Error('Unexpected response structure from OpenAI API');
    }
  } catch (error) {
    console.error('Error during chat completion:', error);
    if (error.response) {
      console.error('OpenAI API response:', error.response.data);
    }
    throw new Error('Chat completion failed');
  }
}

async function convertEnglish(text, variant) {
  try {
    let prompt;
    if (variant === 'UK') {
      prompt = `Convert the following text to British English, correcting spelling and grammar where needed: "${text}"`;
    } else {
      prompt = `Convert the following text to American English, correcting spelling and grammar where needed: "${text}"`;
    }
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }]
    });

    if (response.choices && response.choices.length > 0) {
      return response.choices[0].message.content.trim();
    } else {
      throw new Error('Unexpected response structure from OpenAI API');
    }
  } catch (error) {
    console.error('Error during conversion:', error);
    throw new Error('Conversion failed');
  }
}

async function convertRephraser(text) {
  try {
    let prompt = `Please rephrase the following sentence while maintaining its original meaning: "${text}"`;
 
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }]
    });

    if (response.choices && response.choices.length > 0) {
      return response.choices[0].message.content.trim();
    } else {
      throw new Error('Unexpected response structure from OpenAI API');
    }
  } catch (error) {
    console.error('Error during conversion:', error);
    throw new Error('Conversion failed');
  }
}

async function articleRewrite(text) {
  if (!text || text.trim().length === 0) {
    throw new Error('Please provide text to rewrite');
  }

  try {
    // Create a more detailed prompt for better results
    const prompt = `Please rewrite the following text in a different way while maintaining its core meaning and key points. Make it original and engaging:

Original text: ${text}

Instructions:
- Maintain the same key information and facts
- Use different vocabulary and sentence structures
- Keep the same tone (formal/informal) as the original
- Ensure the rewritten version is coherent and natural
- Preserve any technical terms or proper nouns

Rewritten version:`;
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a skilled content rewriter who excels at rephrasing text while maintaining its original meaning and improving its clarity and engagement.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7, // Add some creativity but not too much
      max_tokens: 2000, // Adjust based on your needs
      presence_penalty: 0.6, // Encourage some variation in language
      frequency_penalty: 0.6 // Discourage repetitive phrases
    });

    if (!response.choices || response.choices.length === 0) {
      throw new Error('No response received from OpenAI API');
    }

    const rewrittenText = response.choices[0].message.content.trim();
    
    if (!rewrittenText) {
      throw new Error('Received empty response from OpenAI API');
    }

    return {
      success: true,
      newArticle: rewrittenText,
      originalText: text
    };

  } catch (error) {
    console.error('Error during article rewrite:', error);
    
    // Return a structured error response
    return {
      success: false,
      error: error.message || 'Failed to rewrite article',
      originalText: text
    };
  }
}

async function checkGrammer(text) {
  try {
    let prompt = `In the following text, find any grammer mistake word, correct them, and wrap the corrected words in <b> tags. Return only corrected text with the corrected words in <b> tags : "${text}"`;
 
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }]
    });

    if (response.choices && response.choices.length > 0) {
      return response.choices[0].message.content.trim();
    } else {
      throw new Error('Unexpected response structure from OpenAI API');
    }
  } catch (error) {
    console.error('Error during conversion:', error);
    throw new Error('Conversion failed');
  }
}

async function paraphrasingChecker(text) {
  try {
    let prompt = `Paraphrase the following text to convey the same meaning using different words and sentence structures. Wrap any words or phrases that have been significantly changed in <b> tags. Here's the text to paraphrase: "${text}"`;
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }]
    });

    if (response.choices && response.choices.length > 0) {
      return response.choices[0].message.content.trim();
    } else {
      throw new Error('Unexpected response structure from OpenAI API');
    }
  } catch (error) {
    console.error('Error during paraphrasing:', error);
    throw new Error('Paraphrasing failed');
  }
}


async function rewriteParagraph(text) {
  try {
    let prompt = `Rewrite the following paragraph:\n\n${text}`;
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }]
    });

    if (response.choices && response.choices.length > 0) {
      return response.choices[0].message.content.trim();
    } else {
      throw new Error('Unexpected response structure from OpenAI API');
    }
  } catch (error) {
    console.log('Error during rewrite paragraph', error);
    throw new Error('Rewrite failed');
  }
}

async function SentenceChecker(text) {
  try {

    let prompt = `Check the following sentence for grammar and spelling mistakes, correct them, and place <b> tags around the corrected words: \n\n${text}`;
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }]
    });

    if (response.choices && response.choices.length > 0) {
      return response.choices[0].message.content.trim();
    } else {
      throw new Error('Unexpected response structure from OpenAI API');
    }
  } catch (error) {
    console.log('Error during rewrite paragraph', error);
    throw new Error('Rewrite failed');
  }
}

async function rewordingTool(text) {
  try {

    let prompt = `You are an advanced rewording and highlighting tool. Your task is to rephrase given text and highlight significant changes. Please perform the following actions:

Read and understand the provided text.
Rewrite the text in a way that preserves the original meaning but varies word choice and sentence structure.
Highlight significant changes made in the rewritten text. Use bold text for highlighting.
Provide both the original and rewritten text for comparison.

Please reword and highlight the following text: \n\n${text}`;
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }]
    });

    if (response.choices && response.choices.length > 0) {

      return response.choices[0].message.content.trim();
    } else {
      throw new Error('Unexpected response structure from OpenAI API');
    }
  } catch (error) {
    console.log('Error during rewrite paragraph', error);
    throw new Error('Rewrite failed');
  }
}


async function PunctuationChecker(text) {
  try {
    let prompt = `You are an advanced punctuation checker and correction tool. Your task is to analyze the given text for punctuation errors, correct them, and provide only the corrected punctuation. Follow these steps:

Carefully examine the provided text for any punctuation errors.
Identify and correct all punctuation mistakes, including but not limited to:

Missing or misplaced periods, commas, semicolons, and colons
Incorrect use of quotation marks, apostrophes, and hyphens
Improper capitalization
Spacing issues around punctuation marks


Do not alter any words or change the original text structure.
Output only the corrected punctuation marks and capitalization, preserving their positions relative to the original text.
Use underscores (_) to represent spaces between words and line breaks.

For example, if the input is:
"hello world how are you today"
Your output might be:
"______,_____?"
This represents: "Hello world, how are you today?"
Please provide the corrected punctuation for the following text: \n\n${text}`;
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }]
    });

    if (response.choices && response.choices.length > 0) {
      return response.choices[0].message.content.trim();
    } else {
      throw new Error('Unexpected response structure from OpenAI API');
    }
  } catch (error) {
    console.log('Error during rewrite paragraph', error);
    throw new Error('Rewrite failed');
  }
}

async function EssayChecker(text) {
  try {
    let prompt = `Check the following Essay for grammar and spelling mistakes, correct them, and place <b> tags around the corrected words: \n\n${text}`;
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }]
    });

    // Check if the response structure is correct
    if (response.choices && response.choices.length > 0) {
      // Access the content of the response from OpenAI
      return response.choices[0].message.content.trim();
    } else {
      throw new Error('Unexpected response structure from OpenAI API');
    }
  } catch (error) {
    console.log('Error during rewrite paragraph', error);
    throw new Error('Rewrite failed');
  }
}

async function PaperCheckerfunction(text) {
  try {
    let prompt = `You are an advanced academic paper and assignment checker. Your task is to thoroughly review the provided text for grammar, spelling, punctuation, and style errors, then correct them. Follow these steps:

Carefully examine the entire text for:

Grammar mistakes
Spelling errors
Punctuation issues
Style inconsistencies
Unclear or awkward phrasing


For each error you identify:

Correct the mistake directly in the text
Enclose the corrected word or phrase in <b> tags


Pay special attention to:

Subject-verb agreement
Proper use of tenses
Correct word choice and usage
Consistent formatting of citations and references (if applicable)
Appropriate academic tone and style


Maintain the original meaning and intent of the text while making your corrections.
After the corrected text, provide a brief explanation of the major changes made, if necessary.

Example:
Original: "The experment was conducted with 50 participents."
Corrected: "The <b>experiment</b> was conducted with <b>50 participants</b>."
Please review, correct, and highlight the corrections for the following text: \n\n${text}`;
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }]
    });

    // Check if the response structure is correct
    if (response.choices && response.choices.length > 0) {
      // Access the content of the response from OpenAI
      return response.choices[0].message.content.trim();
    } else {
      throw new Error('Unexpected response structure from OpenAI API');
    }
  } catch (error) {
    console.log('Error during rewrite paragraph', error);
    throw new Error('Rewrite failed');
  }
}

async function OnlineProofreaderChecker(text) {
  try {
    let prompt = `You are an advanced online proofreading tool. Your task is to carefully analyze the given text for grammar and spelling errors, correct them, highlight the corrections, and provide a count of each type of error. Follow these instructions:

Examine the provided text thoroughly for grammar and spelling mistakes.
Correct any errors you find, maintaining the original meaning and intent of the text.
For each correction made:

Replace the incorrect word or phrase with the correct version.
Enclose the corrected text in <b> tags.


Do not alter any correctly written parts of the text.
Focus solely on grammar and spelling corrections. Do not make changes for style, punctuation, or formatting unless they are directly related to grammar or spelling.
Keep a count of the number of grammar mistakes and spelling mistakes separately.
After processing, output the following:
a) The corrected version of the text with the corrections highlighted in <b> tags.
b) A summary stating the total number of grammar mistakes and spelling mistakes found.

Example input:
"The cat chased it's tail befor jumping onto the furnature."
Example output:
Corrected text:
"The cat chased <b>its</b> tail <b>before</b> jumping onto the <b>furniture</b>."
Error summary:
Grammar mistakes: 1
Spelling mistakes: 2
Please proofread and correct the following text: \n\n${text}`;
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }]
    });

    // Check if the response structure is correct
    if (response.choices && response.choices.length > 0) {
      // Access the content of the response from OpenAI
      return response.choices[0].message.content.trim();
    } else {
      throw new Error('Unexpected response structure from OpenAI API');
    }
  } catch (error) {
    console.log('Error during rewrite paragraph', error);
    throw new Error('Rewrite failed');
  }
}

async function WordChangerfunction(text) {
  try {
    let prompt = `You are an advanced AI text rewriting and enhancement tool. Your task is to extensively reword and improve the given text, highlighting changes with background colors and underlining important unchanged words. Follow these instructions:

Thoroughly analyze the provided text.
Extensively rewrite the text to enhance its quality, clarity, and sophistication while preserving the core meaning.
Make the following specific changes:

Change more than 10 words in the text, highlighting each with a background color.
Identify 5 to 10 important words that remain unchanged and underline them.


For each changed word or phrase:

Replace it with a more refined, precise, or enhanced alternative.
Enclose the changed text in a tag that will apply a full background color:
<change color="colorName">changed text</change>

Use these colors randomly: yellow, pink, green, blue, orange
For 5 to 10 important unchanged words:

Enclose them in an underline tag:
<underline>important unchanged word</underline>


Ensure that at least 10 words are changed and colored, and 5-10 important unchanged words are underlined.
After processing, output only the enhanced version with color and underline tags.

Example input:
"AI is changing how we work and live. It's making things faster and smarter in many areas."
Example output:
"<change color="yellow">Artificial intelligence</change> is <change color="pink">revolutionizing</change> our <underline>work</underline> and <underline>life</underline> paradigms. It's <change color="green">dramatically enhancing</change> <change color="blue">efficiency</change> and <change color="orange">cognitive capabilities</change> across <underline>many</underline> <change color="yellow">diverse</change> <change color="pink">sectors</change> of <change color="green">human endeavor</change>."
Please extensively reword and enhance the following text, ensuring more than 10 words are changed and colored, and 5-10 important unchanged words are underlined: \n\n${text}`;
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }]
    });

    // Check if the response structure is correct
    if (response.choices && response.choices.length > 0) {
      // Access the content of the response from OpenAI
      return response.choices[0].message.content.trim();
    } else {
      throw new Error('Unexpected response structure from OpenAI API');
    }
  } catch (error) {
    console.log('Error during rewrite paragraph', error);
    throw new Error('Rewrite failed');
  }
}

async function SentenceRewriterfunction(text) {
  try {
    let prompt = `You are an advanced AI Sentence rewriting and enhancement tool. Your task is to extensively reword, grammar mistake, spelling mistake and improve the given text, highlighting changes with background colors and underlining important unchanged words. Follow these instructions:

Thoroughly analyze the provided text.
Extensively rewrite the text to enhance its quality, clarity, and sophistication while preserving the core meaning.
Make the following specific changes:

Change more than 10 words in the text, highlighting each with a background color.
Identify 5 to 10 important words that remain unchanged and underline them.


For each changed word or phrase:

Replace it with a more refined, precise, or enhanced alternative.
Enclose the changed text in a tag that will apply a full background color:
<change color="colorName">changed text</change>

Use these colors randomly: yellow, pink, green, blue, orange
For 5 to 10 important unchanged words:

Enclose them in an underline tag:
<underline>important unchanged word</underline>


Ensure that at least 10 words are changed and colored, and 5-10 important unchanged words are underlined.
After processing, output only the enhanced version with color and underline tags.

Example input:
"AI is changing how we work and live. It's making things faster and smarter in many areas."
Example output:
"<change color="yellow">Artificial intelligence</change> is <change color="pink">revolutionizing</change> our <underline>work</underline> and <underline>life</underline> paradigms. It's <change color="green">dramatically enhancing</change> <change color="blue">efficiency</change> and <change color="orange">cognitive capabilities</change> across <underline>many</underline> <change color="yellow">diverse</change> <change color="pink">sectors</change> of <change color="green">human endeavor</change>."
Please extensively reword and enhance the following text, ensuring more than 10 words are changed and colored, and 5-10 important unchanged words are underlined: \n\n${text}`;
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }]
    });

    // Check if the response structure is correct
    if (response.choices && response.choices.length > 0) {
      // Access the content of the response from OpenAI
      return response.choices[0].message.content.trim();
    } else {
      throw new Error('Unexpected response structure from OpenAI API');
    }
  } catch (error) {
    console.log('Error during rewrite paragraph', error);
    throw new Error('Rewrite failed');
  }
}

async function EssayRewriterfunction(text) {
  try {
    let prompt = `You are an advanced AI Essay rewriting and enhancement tool. Your task is to extensively reword, grammar mistake, spelling mistake and improve the given text, highlighting changes with background colors and underlining important unchanged words. Follow these instructions:

Thoroughly analyze the provided text.
Extensively rewrite the text to enhance its quality, clarity, and sophistication while preserving the core meaning.
Make the following specific changes:

Change more than 10 words in the text, highlighting each with a background color.
Identify 5 to 10 important words that remain unchanged and underline them.


For each changed word or phrase:

Replace it with a more refined, precise, or enhanced alternative.
Enclose the changed text in a tag that will apply a full background color:
<change color="colorName">changed text</change>

Use these colors randomly: yellow, pink, green, blue, orange
For 5 to 10 important unchanged words:

Enclose them in an underline tag:
<underline>important unchanged word</underline>


Ensure that at least 10 words are changed and colored, and 5-10 important unchanged words are underlined.
After processing, output only the enhanced version with color and underline tags.

Example input:
"AI is changing how we work and live. It's making things faster and smarter in many areas."
Example output:
"<change color="yellow">Artificial intelligence</change> is <change color="pink">revolutionizing</change> our <underline>work</underline> and <underline>life</underline> paradigms. It's <change color="green">dramatically enhancing</change> <change color="blue">efficiency</change> and <change color="orange">cognitive capabilities</change> across <underline>many</underline> <change color="yellow">diverse</change> <change color="pink">sectors</change> of <change color="green">human endeavor</change>."
Please extensively reword and enhance the following text, ensuring more than 10 words are changed and colored, and 5-10 important unchanged words are underlined: \n\n${text}`;
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }]
    });

    // Check if the response structure is correct
    if (response.choices && response.choices.length > 0) {
      // Access the content of the response from OpenAI
      return response.choices[0].message.content.trim();
    } else {
      throw new Error('Unexpected response structure from OpenAI API');
    }
  } catch (error) {
    console.log('Error during rewrite paragraph', error);
    throw new Error('Rewrite failed');
  }
}

async function Summarizerfunction(text) {
  try {
    let prompt = `You are an advanced AI text summarization tool. Your task is to create concise and accurate summaries of given texts while preserving the key information and main ideas. Follow these instructions:

Carefully read and analyze the entire input text.
Identify the main topics, key points, and essential information in the text.
Create a summary that:

Captures the core message and main ideas of the original text
Is significantly shorter than the original
Maintains a logical flow and coherence
Uses clear and concise language

Focus on including:

The central theme or argument
Key supporting points or evidence
Important conclusions or outcomes
Any crucial data or statistics

Avoid:

Including minor details or examples
Repeating information
Using unnecessary words or phrases
Introducing new information not present in the original text

Please summarize the following text: \n\n${text}`;
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }]
    });

    // Check if the response structure is correct
    if (response.choices && response.choices.length > 0) {
      // Access the content of the response from OpenAI
      return response.choices[0].message.content.trim();
    } else {
      throw new Error('Unexpected response structure from OpenAI API');
    }
  } catch (error) {
    console.log('Error during rewrite paragraph', error);
    throw new Error('Rewrite failed');
  }
}

async function ParagraphRephrasefunction(text) {
  try {
    let prompt = `You are an advanced AI Paragraph Rephrase and enhancement tool. Your task is to extensively reword, grammar mistake, spelling mistake and improve the given text, highlighting changes with background colors and underlining important unchanged words. Follow these instructions:

Thoroughly analyze the provided text.
Extensively rewrite the text to enhance its quality, clarity, and sophistication while preserving the core meaning.
Make the following specific changes:

Change more than 10 words in the text, highlighting each with a background color.
Identify 5 to 10 important words that remain unchanged and underline them.


For each changed word or phrase:

Replace it with a more refined, precise, or enhanced alternative.
Enclose the changed text in a tag that will apply a full background color:
<change color="colorName">changed text</change>

Use these colors randomly: yellow, pink, green, blue, orange
For 5 to 10 important unchanged words:

Enclose them in an underline tag:
<underline>important unchanged word</underline>


Ensure that at least 10 words are changed and colored, and 5-10 important unchanged words are underlined.
After processing, output only the enhanced version with color and underline tags.

Example input:
"AI is changing how we work and live. It's making things faster and smarter in many areas."
Example output:
"<change color="yellow">Artificial intelligence</change> is <change color="pink">revolutionizing</change> our <underline>work</underline> and <underline>life</underline> paradigms. It's <change color="green">dramatically enhancing</change> <change color="blue">efficiency</change> and <change color="orange">cognitive capabilities</change> across <underline>many</underline> <change color="yellow">diverse</change> <change color="pink">sectors</change> of <change color="green">human endeavor</change>."
Please extensively reword and enhance the following text, ensuring more than 10 words are changed and colored, and 5-10 important unchanged words are underlined: \n\n${text}`;
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }]
    });

    // Check if the response structure is correct
    if (response.choices && response.choices.length > 0) {
      // Access the content of the response from OpenAI
      return response.choices[0].message.content.trim();
    } else {
      throw new Error('Unexpected response structure from OpenAI API');
    }
  } catch (error) {
    console.log('Error during rewrite paragraph', error);
    throw new Error('Rewrite failed');
  }
}

async function parappharseGeneratorfunction(text) {
  try {
    let prompt = `You are an advanced AI paraphrase generator tool. Your task is to rephrase the given text while maintaining its original meaning, improving clarity, and enhancing vocabulary. Follow these instructions:

Carefully analyze the provided text.
Paraphrase the entire text, aiming to change the structure and wording while preserving the core meaning.
Make the following specific changes:

Rephrase at least 70% of the text, highlighting each significant change with a background color.
Identify 3 to 5 key terms or phrases that should remain unchanged and underline them.


For each paraphrased section:

Use alternative expressions, synonyms, or restructured sentences.
Enclose the paraphrased text in a tag that will apply a full background color:
<change color="colorName">paraphrased text</change>

Use these colors randomly: yellow, pink, green, blue, orange
For 3 to 5 key terms or phrases that remain unchanged:

Enclose them in an underline tag:
<underline>key unchanged term</underline>


Enhance the paraphrasing by:

Varying sentence structures (e.g., active to passive voice or vice versa)
Changing word order where appropriate
Using more sophisticated vocabulary when suitable
Breaking down or combining sentences to improve flow


Ensure the paraphrased version:

Maintains the original tone and style (formal, informal, technical, etc.)
Preserves any field-specific terminology
Retains the original meaning and intent of the text


After processing, output only the paraphrased version with color and underline tags.

Example input:
"Artificial intelligence is rapidly changing the way we work and live. It's making processes more efficient and enabling smarter decision-making across various industries."
Example output:
"<change color="yellow">The advent of</change> <underline>artificial intelligence</underline> <change color="pink">is swiftly transforming</change> our <change color="green">professional and personal landscapes</change>. <change color="blue">This technology is enhancing operational efficiency</change> and <change color="orange">facilitating more informed choices</change> <change color="yellow">in a multitude of sectors</change>."
Please paraphrase the following text, ensuring at least 70% is rephrased and highlighted, and 3-5 key terms are underlined: \n\n${text}`;
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }]
    });

    // Check if the response structure is correct
    if (response.choices && response.choices.length > 0) {
      // Access the content of the response from OpenAI
      return response.choices[0].message.content.trim();
    } else {
      throw new Error('Unexpected response structure from OpenAI API');
    }
  } catch (error) {
    console.log('Error during rewrite paragraph', error);
    throw new Error('Rewrite failed');
  }
}

async function imageTranslaterfunction(text, targetLanguage) {
  try {
    let prompt = ` You are an advanced AI image translator tool. Your task is to accurately translate the OCR-extracted text from an image into the specified target language. Follow these instructions:

Receive the OCR-extracted text from the image and the target language for translation.
Carefully analyze the provided text, considering context and any potential idiomatic expressions.
Translate the text into the specified target language, ensuring:

Accurate conveyance of the original meaning
Proper grammar and syntax in the target language
Appropriate use of idiomatic expressions, if applicable
Preservation of any specialized terminology or proper nouns


If the OCR text contains any apparent errors or ambiguities:

Attempt to infer the correct meaning based on context
Provide the best possible translation
Flag these instances in your response for user review


Maintain the original formatting as much as possible, including:

Line breaks
Paragraph structures
Lists or bullet points


For any text that should not be translated (e.g., brand names, certain proper nouns):

Keep the original text
Provide a transliteration if the target language uses a different script


After translation, provide:

The full translated text
A brief summary of any challenging aspects of the translation or potential ambiguities
Confidence level of the translation (e.g., high, medium, low) based on the clarity of the OCR text and the complexity of the translation



Please translate the following OCR-extracted text into ${targetLanguage}:
 \n\n${text}`;
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }]
    });

    // Check if the response structure is correct
    if (response.choices && response.choices.length > 0) {
      // Access the content of the response from OpenAI
      return response.choices[0].message.content.trim();
    } else {
      throw new Error('Unexpected response structure from OpenAI API');
    }
  } catch (error) {
    console.log('Error during rewrite paragraph', error);
    throw new Error('Rewrite failed');
  }
}


module.exports = {
  getChatCompletion,
  convertEnglish,
  convertRephraser,
  articleRewrite,
  checkGrammer,
  paraphrasingChecker,
  rewriteParagraph,
  SentenceChecker,
  rewordingTool,
  PunctuationChecker,
  EssayChecker,
  PaperCheckerfunction,
  OnlineProofreaderChecker,
  WordChangerfunction,
  SentenceRewriterfunction,
  EssayRewriterfunction,
  Summarizerfunction,
  ParagraphRephrasefunction,
  parappharseGeneratorfunction,
  imageTranslaterfunction
};
