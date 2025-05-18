import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
dotenv.config();

const app = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(bodyParser.json());

console.log('OpenAI Key:', process.env.OPENAI_API_KEY ? 'Loaded' : 'NOT FOUND');

async function fetchWikipediaSummary(url) {
  try {
    const match = url.match(/wikipedia\.org\/wiki\/([^#?]+)/);
    if (!match) return null;
    const title = decodeURIComponent(match[1]);
    const apiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${title}`;
    const res = await fetch(apiUrl);
    if (!res.ok) return null;
    const data = await res.json();
    return data.extract || null;
  } catch {
    return null;
  }
}

app.post('/api/generate-quiz', async (req, res) => {
  const { topic } = req.body;
  console.log('Received topic:', topic);
  if (!topic) {
    console.error('No topic provided');
    return res.status(400).json({ error: 'Missing topic' });
  }

  let context = '';
  let promptTopic = topic;

  // If input is a Wikipedia URL, fetch the summary
  if (topic.startsWith('http') && topic.includes('wikipedia.org/wiki/')) {
    try {
      const summary = await fetchWikipediaSummary(topic);
      if (summary) {
        context = summary;
        promptTopic = 'this article';
        console.log('Fetched Wikipedia summary:', summary.slice(0, 200), '...');
      } else {
        console.error('Failed to fetch Wikipedia summary');
        return res.status(400).json({ error: 'Could not fetch Wikipedia summary.' });
      }
    } catch (err) {
      console.error('Error fetching Wikipedia summary:', err);
      return res.status(500).json({ error: 'Error fetching Wikipedia summary.' });
    }
  }

  const prompt = `${context ? `Based on the following article summary: ${context}\n` : ''}Create 7 multiple-choice questions (with 4 options each, and the correct answer marked) about the topic: "${promptTopic}". Return as JSON: [{ "question": "...", "options": ["A", "B", "C", "D"], "answer": 2 }]`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }]
      })
    });
    const data = await response.json();
    console.log('OpenAI raw response:', JSON.stringify(data, null, 2));
    const message = data.choices && data.choices[0] && data.choices[0].message;
    const text = message && (message.content || message.text || JSON.stringify(message));
    if (!text) {
      return res.status(500).json({ error: 'OpenAI did not return a valid response.', details: data });
    }
    const jsonStart = text.indexOf('[');
    const jsonEnd = text.lastIndexOf(']');
    if (jsonStart === -1 || jsonEnd === -1) {
      console.error('OpenAI did not return JSON:', text);
      return res.status(500).json({ error: 'OpenAI did not return JSON.', details: text });
    }
    const quizJson = JSON.parse(text.slice(jsonStart, jsonEnd + 1));
    res.json({ questions: quizJson });
  } catch (err) {
    console.error('Error from OpenAI or JSON parse:', err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
}); 