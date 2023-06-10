const express = require("express");
const { pool } = require("./authRoutes");
const router = express.Router();

router.get('/', async (req, res) => {
    const query = 'SELECT * FROM breeds';
    pool.query(query, (error, results) => {
        if (!results) {
            res.json({ status: error });
        } else {
            res.json(results);
        }
    });
});

router.get("/:name", async (req, res) => {
    const query = 'SELECT * FROM breeds WHERE name = ?';
    pool.query(query, [req.params.name], (error, results) => {
        if (!results[0]) {
            res.json({ status: error });
        } else {
            res.json(results[0]);
        }
    });
});

router.put("/updateDogs/:id", async (req, res) => {
    const { id } = req.params;
    const { life_expectancy, origin, name, type } = req.body;
    console.log(life_expectancy, origin, name, type, id);
    const query = `UPDATE breeds SET life_expectancy = ?, origin = ?, name = ?, type = ? WHERE id = ?`;
    pool.query(query, [life_expectancy, origin, name, type, id], (error) => {
        if (error) {
            res.json({ status: error });
        } else {
            res.json({ status: 'Breed updated successfully' });
        }
    });
});

router.delete("/:name", async (req, res) => {
    const query = 'DELETE FROM breeds WHERE name = ?';
    pool.query(query, [req.params.name], (error, results) => {
        if (!results) {
            res.json({ status: error });
        } else {
            res.json(results[0]);
        }
    });
});

router.post("/", async (req, res) => {
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

module.exports = router;