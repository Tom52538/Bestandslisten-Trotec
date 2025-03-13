// server.js
const express = require('express');
const { Client } = require('pg');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

// Umgebungsvariablen laden
dotenv.config();

// Express App erstellen
const app = express();

// Middleware
app.use(bodyParser.json());

// PostgreSQL-Client erstellen
const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

// PostgreSQL verbinden
client.connect()
  .then(() => console.log('Verbunden mit PostgreSQL ✅'))
  .catch(err => console.error('Fehler bei Verbindung zu PostgreSQL:', err));

// Testroute für Server
app.get('/', (req, res) => {
  res.send('API läuft 🚀');
});

// Testroute für PostgreSQL
app.get('/test-db', async (req, res) => {
  try {
    const result = await client.query('SELECT NOW()');
    res.json({ success: true, time: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Server starten
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
  console.log(`Server gestartet auf Port ${port}`);
});
