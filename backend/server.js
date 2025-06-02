// const fetch = require('node-fetch'); 
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = [
  'http://127.0.0.1:5500',                
  'https://moon-seven-amber.vercel.app', 
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like Postman or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `CORS policy: Origin ${origin} is not allowed`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

const app_id = process.env.APP_ID;
const app_secret = process.env.APP_SECRET;


const basicToken = Buffer.from(`${app_id}:${app_secret}`).toString('base64');

app.post('/moon-phase', async (req, res) => {
  const { date, latitude = 12.9716, longitude = 77.5946 } = req.body;

  try {
    const response = await fetch('https://api.astronomyapi.com/api/v2/studio/moon-phase', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${basicToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        observer: { latitude, longitude, date },
        view: {
          type: 'portrait-simple',
          orientation: 'south-up',
        },
        style: {
          moonStyle: 'default',
          backgroundStyle: 'stars',
          backgroundColor: '#000000',
          headingColor: '#ffffff',
          textColor: '#ffffff',
        },
      }),
    });

  if (!response.ok) {
  const errorText = await response.text();
  console.error('AstronomyAPI error:', errorText);
  return res.status(response.status).json({ error: JSON.parse(errorText) });
}
console.log('Incoming date:', date);



    const data = await response.json();
    res.json({ imageUrl: data.data.imageUrl, phase: data.data.phase || 'Unknown' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/', (req, res) => {
  res.send('Server is running');
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
