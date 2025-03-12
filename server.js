const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const path = require('path');
const app = express();

// Middleware: JSON-Parsing
app.use(bodyParser.json());

// Statische Dateien aus dem "build"-Ordner ausliefern
app.use(express.static(path.join(__dirname, 'build')));

// PostgreSQL-Verbindung herstellen
// Stelle sicher, dass die Umgebungsvariable DATABASE_URL gesetzt ist, z.B.:
// postgresql://postgres:HgXaPRiBvgGpAmecdvRCFeNJBJtSXVKk@yamanote.proxy.rlwy.net:17621/railway
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Viele Cloud-Anbieter (inklusive Railway) erfordern SSL:
  ssl: {
    rejectUnauthorized: false
  }
});

// Testen der PostgreSQL-Verbindung
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error connecting to PostgreSQL:', err.stack);
  } else {
    console.log('Connected to PostgreSQL database!');
    release();
  }
});

// Beispiel-API-Endpunkt: Gibt die aktuelle Zeit aus der Datenbank zurück
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

// Alle anderen Routen an die index.html im "build"-Ordner weiterleiten
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Den Port aus der Umgebung verwenden (wichtig für Railway) oder auf 3000 zurückfallen
const port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0', () => {
  console.log(`Server started on port ${port}`);
});
