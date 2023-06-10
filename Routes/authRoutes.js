const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const mysql = require("mysql2");
const jwt = require("jsonwebtoken");
const e = require("express");

dotenv.config();
const secret = "my-secret-key"

authRouter.get("/allUsers", async (req, res) => {
    const query = 'SELECT * FROM users';
    pool.query(query, (error, results) => {
        if (!results[0]) {
            res.json({ status: error });
        } else {
            res.json(results);
        }
    });
});

authRouter.get("/:username", async (req, res) => {
    const query = 'SELECT * FROM users WHERE username = ?';
    pool.query(query, [req.params.username], (error, results) => {
        if (!results[0]) {
            res.json({ status: error });
        } else {
            res.json(results);
        }
    });
});

authRouter.post('/addUsers', async (req, res) => {
    const data = {
        id: req.body.id,
        email: req.body.email,
        password: req.body.password
    }
    const query = 'INSERT INTO users VALUES (?, ?, ?)';
    pool.query(query, Object.values(data), (error, results) => {
        if (!results) {
            res.json({ status: error });
        } else {
            res.json({ status: "Success", data: data });
        }
    });
});

authRouter.post('/signIn', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const query = "SELECT * FROM users WHERE username = ?";

    pool.query(query, [username], (error, results) => {
        if (error) {
            res.status(500).json({ status: "Error signingIn" });
            return
        }
        if (results.length === 0) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }
        const user = results[0];
        const userSigned = bcrypt.compare(password, user.password);
        if (userSigned) {
            const token = jwt.sign({ username }, secret, { expiresIn: 60 * 60 });
            res.json({ token });
        } else {
            res.json({ status: "User is not signedIn and check your credentials" });
        }
    });
});

authRouter.post('/signUp', async (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    const hashedPassword = await bcrypt.hash(password, 10);
    const data = {
        email,
        password: hashedPassword,
        username,
    }
    const query = 'SELECT * FROM users WHERE email = ?';
    pool.query(query, [email], (error, results) => {
        if (error) {
            res.status(500).json({error:  "Some error occured!"});
            return;
        }
        const user = results[0];
        if (user) {
            res.json({ status: "Email is already registered!" });
        } else {
            const query = 'INSERT INTO users VALUES (?, ?, ?, ?)';
            pool.query(query, [data.id, data.email, data.password, data.username], (error, results) => {
                if (!results) {
                    res.json({ status: error });
                } else {
                    const token = jwt.sign({ username }, secret, { expiresIn: 60 * 60 });
                    res.json({ token });
                }
            })
        }
    });
});

const pool = mysql.createPool({
    host: process.env.host,
    user: process.env.user, // e.g. 'my-db-user'
    password: process.env.password, // e.g. 'my-db-password'
    database: process.env.database, // e.g. 'my-database'
});

module.exports = { authRouter, pool };