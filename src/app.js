const express = require("express");
const app = express();

const path = require("node:path");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

app.use("/", require("./routes/routers"));

// 404 for anything unmatched
app.use((req, res) => res.status(404).send("Page not found"));

// Error handler (must have 4 args)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Something went wrong");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

module.exports = app;
