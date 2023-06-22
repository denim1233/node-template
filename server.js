const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

const dbConfig = require("./config/database.config.js");
const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

mongoose
  .connect(dbConfig.url, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Databse Connected Successfully!!");
  })
  .catch((err) => {
    console.log("Could not connect to the database", err);
    process.exit();
  });

app.get("/", (req, res) => {
  res.json({ message: "Hello Crud Node Express" });
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});

const UserRoute = require("./app/routes/User");
const ToolsRoute = require("./app/routes/Tools");
app.use("/user", UserRoute);
app.use("/tools", ToolsRoute);

// app.get("/download", function (req, res) {
//   const file = `${__dirname}/storage/files/sampledownload.mp3`;
//   res.download(file); // Set disposition and send it.
// });

const auth = require("./middleware/auth");

app.post("/welcome", auth, (req, res) => {
  res.status(200).send("Welcome 🙌 ");
});
