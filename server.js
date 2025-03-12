const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();

// Middleware
app.use(bodyParser.json());

// Statische Dateien aus dem "build"-Ordner ausliefern
app.use(express.static(path.join(__dirname, 'build')));

// Verbindung zur SQLite-Datenbank
const db = new sqlite3.Database('./db/database.db', (err) => {
    if (err) {
        console.error('Error connecting to SQLite database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

// Beispiel-API-Endpunkt
app.get('/api/example', (req, res) => {
    res.json({ message: 'This is an example endpoint' });
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
