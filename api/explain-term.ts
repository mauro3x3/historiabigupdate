import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { term, context } = req.body;
  if (!term) {
    return res.status(400).json({ error: 'Missing term' });
  }

  const prompt = `Explain the term "${term}" in 10-15 simple words for a history student. Context: ${context || ''}`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 100,
    });

    const explanation = completion.choices[0].message.content?.trim();
    if (!explanation) {
      return res.status(500).json({ error: 'No explanation returned from AI' });
    }

    res.json({ explanation });
  } catch (err) {
    console.error('Error explaining term:', err);
    res.status(500).json({ error: 'Failed to explain term' });
  }
}; 