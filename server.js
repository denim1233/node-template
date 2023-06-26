const mongoose = require("mongoose");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const auth = require("./app/middleware/auth.js");
const UserRoute = require("./app/routes/User");
const ToolsRoute = require("./app/routes/Tools");
const dbConfig = require("./config/database.config.js");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use("/user", UserRoute);
app.use("/tools", ToolsRoute);

app.use(cookieParser("some_secret_1234 SECRET"));
app.listen(3000, (req, res) => {
  console.log("Server is listening on port 3000");
});

app.get("/test", bodyParser.json(), async (req, res) => {
  res.json({ message: "Testing for body parser" });
});

app.get("/welcome", auth, (req, res) => {
  res.json({ message: "Testing for authentication" });
});

mongoose.Promise = global.Promise;
mongoose
  .connect(dbConfig.url, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Mongo Db Connection Success!!");
  })
  .catch((err) => {
    console.log("Could not connect to the database", err);
    process.exit();
  });

require("./app/routes/tutorial.routes")(app);

// const db = require("./app/model");
// db.sequelize
//   .sync()
//   .then(() => {
//     console.log("Synced db.");
//   })
//   .catch((err) => {
//     console.log("Failed to sync db: " + err.message);
//   });

// db.sequelize.sync({ force: true }).then(() => {
//   console.log("Drop and re-sync db.");
// });
