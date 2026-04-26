const express = require('express');
const cors = require('cors');
const path = require('path');
const fetch = require('node-fetch');
const Database = require('better-sqlite3');
const app = express();
const port = process.env.PORT || 8000;
const db = new Database('data.db', { verbose: console.log });

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'static')));

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'static', 'index.html')));

app.get('/health', (req, res) => res.send('Healthy'));

// Create cache table if not exists
const CREATE_CACHE_TABLE = `
  CREATE TABLE IF NOT EXISTS cache (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    expires_at TEXT NOT NULL
  );
`;
db.exec(CREATE_CACHE_TABLE);

const getCache = (key) => {
  const row = db.prepare('SELECT * FROM cache WHERE key = ?').get(key);
  if (row) {
    const expiresAt = new Date(row.expires_at);
    if (expiresAt > new Date()) {
      return JSON.parse(row.value);
    } else {
      // Remove expired cache entry
      db.prepare('DELETE FROM cache WHERE key = ?').run(key);
    }
  }
  return null;
};

const setCache = (key, value, expiresAt) => {
  db.prepare('INSERT OR REPLACE INTO cache (key, value, expires_at) VALUES (?, ?, ?)').run(key, JSON.stringify(value), expiresAt);
};

// Geocode endpoint
app.get('/api/geocode', async (req, res) => {
  try {
    const city = req.query.city;
    const cacheKey = `geocode:${city}`;
    const cachedResult = getCache(cacheKey);
    if (cachedResult) {
      return res.json(cachedResult);
    }

    const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&format=json`);
    if (response.ok) {
      const result = await response.json();
      const expiresAt = new Date(new Date().getTime() + 30 * 60 * 1000).toISOString();
      setCache(cacheKey, result, expiresAt);
      return res.json(result);
    } else {
      throw new Error(`Failed to fetch geocode: ${response.statusText}`);
    }
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
});

// Current weather endpoint
app.get('/api/current-weather', async (req, res) => {
  try {
    const lat = req.query.lat;
    const lon = req.query.lon;
    const cacheKey = `current-weather:${lat},${lon}`;
    const cachedResult = getCache(cacheKey);
    if (cachedResult) {
      return res.json(cachedResult);
    }

    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=temperature_2m,relative_humidity_2m,windspeed_10m`);
    if (response.ok) {
      const result = await response.json();
      const expiresAt = new Date(new Date().getTime() + 30 * 60 * 1000).toISOString();
      setCache(cacheKey, result, expiresAt);
      return res.json(result);
    } else {
      throw new Error(`Failed to fetch current weather: ${response.statusText}`);
    }
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
});

app.listen(port, () => console.log(`Server listening on port ${port}!`));