const express = require("express");
const dotenv = require("dotenv");
const app = express();

dotenv.config();

const port = process.env.PORT;

app.use(express.static("../static/"));

app.listen(port, () => {
  console.log(`App listening on http://localhost:${port}`);
});
