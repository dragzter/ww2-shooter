const express = require("express");
const dotenv = require("dotenv");
const favicon = require("serve-favicon");
const app = express();

dotenv.config();

const port = process.env.PORT;

app.use(favicon("../static/favicon.ico"));
app.use(express.static("../static/"));

app.listen(port, () => {
  console.log(`App listening on http://localhost:${port}`);
});
