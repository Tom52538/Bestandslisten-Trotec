require("dotenv").config();
const express = require("express");
const { Pool } = require("pg");

const app = express();
const port = process.env.PORT || 3000;

// PostgreSQL-Datenbankverbindung
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

app.use(express.json());

// Test-Route
app.get("/", (req, res) => {
  res.send("Bestandsmengen API läuft!");
});

// Alle Bestandsmengen abrufen
app.get("/bestandsmengen", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM bestandsmengen");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Fehler beim Abrufen der Daten");
  }
});

// Neuen Bestand hinzufügen
app.post("/bestandsmengen", async (req, res) => {
  const { kategorie, artikelnummer, bezeichnung, bestand, datum } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO bestandsmengen (kategorie, artikelnummer, bezeichnung, bestand, datum) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [kategorie, artikelnummer, bezeichnung, bestand, datum]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Fehler beim Hinzufügen der Daten");
  }
});

// Server starten
app.listen(port, () => {
  console.log(`Server läuft auf Port ${port}`);
});
