import 'dotenv/config';
import express from 'express';
import axios from 'axios';
import OpenAI from 'openai';

console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY);

const app = express();
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Helper: fetch Wikipedia article plain text and images
async function fetchWikipediaArticle(url) {
  const match = url.match(/\/wiki\/([^#?]+)/);
  if (!match) throw new Error('Invalid Wikipedia URL');
  const title = decodeURIComponent(match[1]);
  const apiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${title}`;
  const { data } = await axios.get(apiUrl);
  
  // Extract images from the article
  let images = [];
  if (data.thumbnail) {
    images.push({
      url: data.thumbnail.source,
      title: data.thumbnail.title || title
    });
  }
  
  // Try to get more images from the article
  try {
    const pageUrl = `https://en.wikipedia.org/api/rest_v1/page/media-list/${title}`;
    const { data: mediaData } = await axios.get(pageUrl);
    if (mediaData && mediaData.items) {
      const additionalImages = mediaData.items
        .filter(item => item.type === 'image')
        .map(item => ({
          url: item.srcset[0].src,
          title: item.title || title
        }))
        .slice(0, 5); // Limit to 5 images
      
      images = [...images, ...additionalImages];
    }
  } catch (error) {
    console.error('Error fetching additional images:', error);
  }
  
  return {
    text: data.extract,
    images
  };
}

// Helper: generate modules in batches
async function generateModulesInBatches({ wikipediaUrls, numModules, journeyTitle, combinedText, allImages }) {
  const batchSize = 3;
  let modules = [];
  let lastModuleTitle = null;
  let totalToGenerate = numModules;
  let batchIndex = 0;

  while (modules.length < totalToGenerate) {
    const remaining = totalToGenerate - modules.length;
    const currentBatchSize = Math.min(batchSize, remaining);
    const prompt = `
You are an expert curriculum designer and historian. Using the following Wikipedia articles as starting points, create the NEXT ${currentBatchSize} modules for a professional learning journey. Output your result as a JSON array of modules, each with:
- title (string)
- lessonText (string, REQUIRED, max 120 words, key terms in **bold** Markdown)
- summary (string)
- quiz (array of 3 questions, each with question, options, correctAnswer, explanation)
- imageUrl (string)
${lastModuleTitle ? `The previous module was titled: "${lastModuleTitle}". Continue from there, do not repeat content.` : ''}

Guidelines:
- Each module MUST have a 'lessonText' (max 120 words) that covers the quiz content and main ideas, with key terms in **bold**
- Place the lessonText before the quiz
- Example lessonText: "**Julius Caesar** was a pivotal figure in **Roman history**. In **44 BC**, he became dictator, leading to the end of the **Roman Republic** and the rise of the **Empire**."
- If you cannot find a lessonText, use the summary as lessonText and warn in the JSON with a field 'lessonTextWarning'.
- Be in correct chronological/historical order
- Avoid repetition and ensure logical progression
- Use the provided images or suggest relevant ones
${journeyTitle ? `- The overall journey title is: "${journeyTitle}"` : ''}

Articles:
${wikipediaUrls.map((url, i) => `${i + 1}. ${url}`).join('\n')}

Combined article content:
${combinedText}

Available images:
${allImages.map(img => `- ${img.title}: ${img.url}`).join('\n')}

Output ONLY the JSON array, and nothing else. Do NOT include any prose, markdown code blocks, or explanation. Do NOT wrap the JSON in triple backticks or any other formatting.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 4000,
    });
    console.log(`Raw OpenAI response (batch ${batchIndex + 1}):`, completion.choices[0].message.content);
    let batchModules = [];
    try {
      const jsonStart = completion.choices[0].message.content.indexOf('[');
      const jsonString = completion.choices[0].message.content.slice(jsonStart);
      batchModules = JSON.parse(jsonString);
      // Fallback: if any module is missing lessonText, use summary
      batchModules = batchModules.map(m => ({
        ...m,
        lessonText: m.lessonText || m.summary || '',
      }));
    } catch (e) {
      console.error('Failed to parse batch as JSON:', e);
      break;
    }
    if (batchModules.length === 0) break;
    modules = [...modules, ...batchModules];
    lastModuleTitle = batchModules[batchModules.length - 1]?.title || lastModuleTitle;
    batchIndex++;
  }
  return modules.slice(0, totalToGenerate);
}

app.post('/api/ai-whale/generate', async (req, res) => {
  const { wikipediaUrls, numModules, journeyTitle } = req.body;
  console.log('Received request for:', wikipediaUrls, numModules, journeyTitle);
  if (!wikipediaUrls || !Array.isArray(wikipediaUrls) || wikipediaUrls.length === 0) {
    return res.status(400).json({ error: 'Missing Wikipedia URLs' });
  }
  const modulesCount = Math.max(1, Math.min(Number(numModules) || 10, 100));

  try {
    // Fetch and combine all article texts and images
    const articleData = await Promise.all(wikipediaUrls.map(fetchWikipediaArticle));
    const combinedText = articleData.map(data => data.text).join('\n\n');
    const allImages = articleData.flatMap(data => data.images);
    console.log('Fetched combined article text:', combinedText.slice(0, 200));
    console.log('Fetched images:', allImages.length);

    // Generate modules in batches and stitch
    const modules = await generateModulesInBatches({ wikipediaUrls, numModules: modulesCount, journeyTitle, combinedText, allImages });
    if (!modules || modules.length === 0) {
      return res.status(500).json({ error: 'Failed to generate modules.' });
    }
    // Compose journey object
    const journeyData = {
      title: journeyTitle || modules[0]?.title || 'AI-Generated Journey',
      description: `AI-generated learning journey based on: ${wikipediaUrls.join(', ')}`,
      modules,
    };
    res.json({ journey: journeyData, images: allImages });
  } catch (err) {
    console.error('Error in /api/ai-whale/generate:', err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || 'localhost';

app.listen(PORT, HOST, () => console.log(`AI Whale running on http://${HOST}:${PORT}`)); 