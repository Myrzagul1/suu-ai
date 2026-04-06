export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Методго уруксат жок' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  const { context, question } = req.body;

  if (!apiKey) {
    return res.status(500).json({ error: 'Серверде API ачкыч жок (Vercel-ден кошуңуз)' });
  }

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          role: 'user',
          parts: [{ text: `Сен суугаруу жана дыйканчылык боюнча эксперт AI жардамчысысың. Кыргыз тилинде кыска, түшүнүктүү, достуктуу жооп бер.\n\nТалаа маалыматы:\n${context}\n\nКолдонуучунун суроосу:\n${question}` }]
        }]
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      return res.status(500).json({ error: data.error?.message || 'Gemini API катасы' });
    }

    const answer = data.candidates[0].content.parts[0].text;
    res.status(200).json({ answer: answer });
  } catch (error) {
    res.status(500).json({ error: 'Сервер катасы же интернет көйгөйү' });
  }
}
