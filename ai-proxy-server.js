
// AI Blog Writer Proxy Server (Node.js + Express)

const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
require('dotenv').config();

app.use(cors());
app.use(express.json());

app.post('/ask-ai', async (req, res) => {
  const { topic, length } = req.body;

  try {
    const openaiRes = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'Kamu adalah penulis artikel blog yang santai, membumi, dan mudah dipahami, khususnya untuk UMKM dan pebisnis pemula di dunia digital.'
          },
          {
            role: 'user',
            content: `Tulis artikel blog sepanjang ${length} kata tentang: ${topic}`
          }
        ],
        temperature: 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const article = openaiRes.data.choices[0].message.content;
    res.json({ article });
  } catch (error) {
    console.error('Error from OpenAI:', error.response?.data || error.message);
    res.status(500).json({ error: 'Gagal menghasilkan artikel.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`AI Proxy Server berjalan di port ${PORT}`);
});
