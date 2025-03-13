// server.js
const express = require('express');
const { Client } = require('pg');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

// Lade Umgebungsvariablen aus der .env Datei
require('dotenv').config();

// Erstelle eine Express-App
const app = require('express')();

// Middleware
app.use(require('body-parser').json());

// Verbindung zur PostgreSQL-Datenbank herstellen
const client = new (require('pg').Client)({
  connectionString: process.env.DATABASE_URL,
});

client.connect()
  .then(() => console.log('Verbunden mit PostgreSQL ✅'))
  .catch(err => console.error('Fehler bei Verbindung zu PostgreSQL:', err));

// Testroute
app.get('/', (req, res) => {
  res.send('API funktioniert! 🚀');
});

// Beispiel-Route, um Datenbankverbindung zu testen
app.get('/test-db', async (req, res) => {
  try {
    const result = await client.query('SELECT NOW()');
    res.json({ connected: true, time: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Server starten
const port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0', () => {
  console.log(`Server gestartet auf Port ${port}`);

  // Datenbankverbindung initialisieren
  client
    .connect()
    .then(() => console.log('Erfolgreich mit PostgreSQL verbunden!'))
    .catch((err) => console.error('Fehler beim Verbinden mit PostgreSQL:', err));
});
