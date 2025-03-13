// server.js

// 1. Module importieren
const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const path = require('path');

// 2. Express-App erstellen
const app = express();

// 3. bodyParser als Middleware, um JSON-Requests zu verarbeiten
app.use(bodyParser.json());

// 4. Statische Dateien aus dem "build"-Ordner bereitstellen
app.use(express.static(path.join(__dirname, 'build')));

// 5. PostgreSQL-Verbindung einrichten
//    ACHTUNG: Der Connection String steht hier im Klartext.
//    In Produktion solltest du ihn als Umgebungsvariable speichern!
const pool = new Pool({
  connectionString: 'postgresql://postgres:eukYhphROXQSSpVMewPWwhpWsFnvikrx@postgres.railway.internal:5432/railway',
  ssl: {
    rejectUnauthorized: false
  }
});

// 6. Verbindung testen (optional)
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error connecting to PostgreSQL:', err.stack);
  } else {
    console.log('Connected to PostgreSQL database!');
    release();
  }
});

// 7. Beispiel-API-Endpunkt: Gibt die aktuelle Zeit aus der Datenbank zurück
app.get('/api/example', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW() AS current_time');
    res.json({
      message: 'This is an example endpoint',
      current_time: result.rows[0].current_time
    });
  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).send('Database error');
  }
});

// 8. Fallback: Alle anderen Routen an die index.html im "build"-Ordner
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// 9. Server starten
const port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0', () => {
  console.log(`Server started on port ${port}`);
});