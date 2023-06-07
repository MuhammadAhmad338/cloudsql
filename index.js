const express = require("express");
var mysql = require("mysql");
const app = express();

app.use(express.json());
const port = process.env.PORT || 8080;



app.listen(port, () => {
    console.log(`Server is listening to this ${port}`);
});



app.get('/', (req, res) => {
    res.json({ status: "Bark Bark! Ready to roll" });
});

app.get("/:name", async (req, res) => {
    const query = 'SELECT * FROM breeds WHERE name = ?';
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
    const query = 'INSERT INTO breeds VALUES (?, ?, ?, ?)';
    pool.query(query, Object.values(data), (error) => {
        if (error) {
            res.json({ status: "Failure!", reason: error.code });
        } else {
            res.json({ status: "Success", data: data });
        }
    });
});

var pool = mysql.createPool({
    user: 'root', // e.g. 'my-db-user'
    password: 'Ahmad@123', // e.g. 'my-db-password'
    database: 'barkbark', // e.g. 'my-database'
    socketPath: '/cloudsql/famous-rhythm-362419:us-central1:barkbark', 
   // e.g. '/cloudsql/project:region:instance'
    // Specify additional properties here.
});
pool.getConnection((err, connect ) => {
    if (err) {
        console.log(err);
    } else {
        console.log("Connected@", connect);
    }
});