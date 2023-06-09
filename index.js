const express = require("express");
const mysql = require("mysql2");
const dotenv = require("dotenv");
const app = express();

dotenv.config();
app.use(express.json());
const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`Server is listening to this ${port}`);
});

app.get('/', (req, res) => {
  const query = 'SELECT * FROM breeds';
  pool.query(query, (error, results) => {
     if (!results) {
        res.json({status: error});  
     } else {
        res.json(results);
     }
  });
});

app.get("/:name", async (req, res) => {
    const query = 'SELECT * FROM breeds WHERE name = ?';
    pool.query(query, [req.params.name], (error, results) => {
        if (!results[0]) {
            res.json({status: error});
        } else {
            res.json(results[0]);
        }
    });
});

app.delete("/:name", (req, res) => {
  const query = 'DELETE FROM breeds WHERE name = ?';
  pool.query(query, [req.params.name], (error, results) => {
    if (!results) {
       res.json({status: error});
    } else  {
      res.json(results[0]);     
    }
  });
});

app.post("/", async (req, res) => {
    const data = {
        id: req.body.id,
        name: req.body.name,
        origin: req.body.origin,
        life_expectancy: req.body.life_expectancy,
        type: req.body.type
    }
    const query = 'INSERT INTO breeds VALUES (?, ?, ?, ?, ?)';
    pool.query(query, Object.values(data), (error) => {
        if (error) {
            res.json({ status: "Failure!", reason: error });
        } else {
            res.json({ status: "Success", data: data });
        }
    });
});

const pool = mysql.createPool({
    host: process.env.host,
    user: process.env.user, // e.g. 'my-db-user'
    password: process.env.password, // e.g. 'my-db-password'
    database: process.env.database, // e.g. 'my-database'
});
