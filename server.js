require("dotenv").config();
const express = require("express");
const { Pool } = require("pg");

const app = express();
const port = process.env.PORT || 3000;

// PostgreSQL-Datenbankverbindung
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

app.use(express.json());

// Test-Route
app.get("/", (req, res) => {
    res.send("Bestandsmengen API läuft!");
});

// GET: Alle Bestandsmengen abrufen
app.get("/bestandsmengen", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM bestandsmengen");
        res.json(result.rows);
    } catch (error) {
        console.error("Fehler beim Abrufen der Bestandsmengen:", error);
        res.status(500).json({ error: error.message });
    }
});
