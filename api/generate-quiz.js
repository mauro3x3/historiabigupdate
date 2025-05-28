export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { topic } = req.body;
  if (!topic) {
    return res.status(400).json({ error: 'Missing topic' });
  }

  const prompt = `Create a quiz about ${topic} with 5 multiple choice questions. Each question should have 4 options and one correct answer. Format the response as a JSON array of objects, each with fields: question (string), options (array of 4 strings), correctAnswer (index 0-3), explanation (string explaining why the correct answer is right). Make the questions challenging but fair, and focus on interesting historical details.`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 2000,
      }),
    });

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content;
    if (!text) {
      return res.status(500).json({ error: 'No response from AI' });
    }

    const jsonStart = text.indexOf('[');
    const jsonEnd = text.lastIndexOf(']');
    if (jsonStart === -1 || jsonEnd === -1) {
      return res.status(500).json({ error: 'Invalid response format' });
    }

    const questions = JSON.parse(text.slice(jsonStart, jsonEnd + 1));
    res.json({ questions });
  } catch (err) {
    console.error('Error generating quiz:', err);
    res.status(500).json({ error: 'Failed to generate quiz' });
  }
} 