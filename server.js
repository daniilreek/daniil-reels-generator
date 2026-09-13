const express = require('express');
const cors = require('cors');
require('dotenv').config();
const Anthropic = require('@anthropic-ai/sdk');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

const prompts = {
  'snippet': 'Генерируй ОДНУ творческую идею для Reels видео (15-60 секунд), которое промоит музыкальный фрагмент перед выходом трека. Создатель — DJ и музыкальный продюсер Daniil Reek, целевая аудитория 25-35 лет. Дай ОДНУ конкретную идею с визуальными и звуковыми элементами. Формат: "Идея: [название]\n\nКонцепция: [описание]\n\nКлючевые элементы:\n- [элемент 1]\n- [элемент 2]\n- [элемент 3]"',
  
  'lifestyle': 'Генерируй ОДНУ творческую идею для Reels видео (15-60 секунд) о повседневной жизни DJ и музыкального продюсера. Целевая аудитория 25-35 лет. Создатель Daniil Reek. Сделай аутентично и релатабельно. Формат: "Идея: [название]\n\nКонцепция: [описание]\n\nКлючевые элементы:\n- [элемент 1]\n- [элемент 2]\n- [элемент 3]"',
  
  'mood': 'Генерируй ОДНУ творческую идею для mood видео в Reels (15-60 секунд), которое комбинирует музыку с атмосферными визуалами. DJ/продюсер Daniil Reek. Целевая аудитория 25-35 лет. Должно вызывать эмоции и энергию. Формат: "Идея: [название]\n\nКонцепция: [описание]\n\nКлючевые элементы:\n- [элемент 1]\n- [элемент 2]\n- [элемент 3]"',
  
  'branding': 'Генерируй ОДНУ творческую идею для Reels видео (15-60 секунд), которое строит узнаваемость бренда и личность артиста Daniil Reek — DJ и музыкального продюсера. Целевая аудитория 25-35 лет. Покажи, что делает этого артиста уникальным. Формат: "Идея: [название]\n\nКонцепция: [описание]\n\nКлючевые элементы:\n- [элемент 1]\n- [элемент 2]\n- [элемент 3]"'
};

app.post('/api/generate', async (req, res) => {
  try {
    const { type } = req.body;
    
    if (!prompts[type]) {
      return res.status(400).json({ error: 'Invalid type' });
    }

    const message = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [
        { role: 'user', content: prompts[type] }
      ]
    });

    const idea = message.content[0].text;
    res.json({ idea });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to generate idea' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
