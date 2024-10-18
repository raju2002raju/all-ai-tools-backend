const express = require('express');
const cors = require('cors');
const { getChatCompletion } = require('./utilis/audio'); 

const app = express();
const port = 8080;

app.use(cors());
app.use(express.json());

const TranslateEnglishToEnglish = require('./routes/convertEnglishToEnglish');
const Rephraser = require('./routes/convertRephraser');
const article = require('./routes/articleRewrite');
const checkGrammer = require('./routes/checkGrammer');
const paraphrasing = require('./routes/parapharsingChecker');
const rewriteParagraph = require('./routes/rewriteParagraph')
const SentenceChecker = require('./routes/sentenceChecker')
const rewordingTool = require('./routes/rewordingTool')
const punctuation = require('./routes/punctuationChecker')
const EassyChecker = require('./routes/essayChecker')
const proofreader = require('./routes/onlineProofreader')
const WordChanger = require('./routes/wordChnager')
const SentenceRewrite = require('./routes/sentenceRewriter')
const EssayRewriter = require('./routes/essayRewriter')
const summarizer = require('./routes/text-summarizer')
const ParagraphRephrase = require('./routes/paragraphRepharse')
const paraphraseGenerator = require('./routes/paraphraseGenerator')
const imageTranslator = require('./routes/imageTranslator')
const aiEssayWriter = require('./routes/aiEssayWriter')
const aiWriter = require('./routes/aiWriter')
const aiTextGenerator = require('./routes/aiTextGenerator')
const titlegenerator = require('./routes/titleGenerator')
const ParagraphGenerator = require('./routes/aiParagraphGenerator')
const essayTitleGenerator = require('./routes/essayTitleGenerator')
const plotGenerator = require('./routes/plotGenerator')
const thesisGenerator = require('./routes/aiThesisGenerator')
const aiStoryGenerator = require('./routes/aiStoryGenerator')
const aiConclusion = require('./routes/aiConcluisonGenerator')
const aiEmailGenerator = require('./routes/aiEmailGenerator')
const metaTaganalyzer = require('./routes/metaTagAnalyzer')

app.use('/v1/api', TranslateEnglishToEnglish);
app.use('/v1/api', Rephraser);
app.use('/v1/api', article);
app.use('/v1/api', checkGrammer);
app.use('/v1/api', paraphrasing);
app.use('/v1/api' , rewriteParagraph);
app.use('/v1/api', SentenceChecker);
app.use('/v1/api', rewordingTool);
app.use('/v1/api', punctuation);
app.use('/v1/api', EassyChecker);
app.use('/v1/api', proofreader);
app.use('/v1/api', WordChanger);
app.use('/v1/api', SentenceRewrite);
app.use('/v1/api', EssayRewriter);
app.use('/v1/api', summarizer)
app.use('/v1/api', ParagraphRephrase)
app.use('/v1/api', paraphraseGenerator)
app.use('/v1/api', imageTranslator)
app.use('/v1/api', aiEssayWriter)
app.use('/v1/api', aiWriter)
app.use('/v1/api', aiTextGenerator)
app.use('/v1/api', titlegenerator)
app.use('/v1/api', ParagraphGenerator)
app.use('/v1/api', essayTitleGenerator)
app.use('/v1/api', plotGenerator)
app.use('/v1/api', thesisGenerator)
app.use('/v1/api', aiStoryGenerator)
app.use('/v1/api', aiConclusion)
app.use('/v1/api', aiEmailGenerator)
app.use('v1/api', metaTaganalyzer)

app.post('/v1/api/check-spelling', async (req, res) => {
  try {
    const { text } = req.body;
    const correctedText = await getChatCompletion(text);
    res.json({ correctedText });
  } catch (error) {
    console.error('Error in /check-spelling:', error);
    res.status(500).json({ error: 'An error occurred while checking spelling' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});