const express = require("express");
const mysql = require("mysql");

const app = express();

app.use(express.json());
const port = process.env.PORT || 8080;

app.get('/', (req, res) => {
    res.json({ status: "Bark Bark! Ready to roll" });
});

app.get("/:name", async (req, res) => {
    const query = "SELECT * FROM breeds WHERE name = ?";
    pool.query(query, [req.params.name], (error, results) => {
        if (!results[0]) {
            res.json({ status: "Not Found!" });
        } else {
            res.json(results[0]);
        }
    });
});

app.post("/", async (req, res) => {
    const data = {
        lifeExpectancy: req.body.lifeExpectancy,
        name: req.body.name,
        origin: req.body.origin,
        type: req.body.type
    }
    const query = "INSERT INTO breeds VALUES (?, ?, ?, ?)";
    pool.query(query, Object.values(data), (error) => {
        if (error) {
            res.json({ status: "Failure!", reason: error.code });
        } else {
            res.json({ status: "Success", data: data });
        }
    });
});

const pool = mysql.createPool({
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  socketPath: `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`,
});