const express = require("express");
const router = require("./Routes/routes");
const cors = require("cors");
const {authRouter} = require("./Routes/authRoutes");
const app = express();

app.use(express.json());
// Enable CORS for all routes
app.use(cors());

app.use('/', authRouter);
app.use('/', router);

const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`Server is listening to this ${port}`);
});

