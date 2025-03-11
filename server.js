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
    console.error("Fehler beim Abrufen der Bestandsmengen:", err);
    res.status(500).send("Fehler beim Abrufen der Daten");
  }
});

// Server starten mit Fehlerbehandlung
const server = app.listen(port, () => {
  console.log(`Server läuft auf Port ${port}`);
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`Port ${port} ist bereits belegt. Beende alten Prozess...`);
    process.exit(1);
  }
});