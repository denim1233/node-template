const mongoose = require("mongoose");
const express = require("express");
const Tools = require("./app/controllers/Tools.js");
const app = express();
const bodyParser = require("body-parser");

const cors = require("cors");
const auth = require("./app/middleware/auth.js");
const UserRoute = require("./app/routes/User");
const ToolsRoute = require("./app/routes/Tools");

const dbConfig = require("./config/database.config.js");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

mongoose.Promise = global.Promise;
mongoose
  .connect(dbConfig.url, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Mongo Db Connection Success!!");
    // Tools.logger.info("Express.js listening on port 3000.");
  })
  .catch((err) => {
    console.log("Could not connect to the database", err);
    // Tools.logger.error("Whooops! This broke with error: ", err);
    process.exit();
  });

app.listen(3000, (req, res) => {
  console.log("Server is listening on port 3000");
});
app.use("/user", UserRoute);
app.use("/tools", ToolsRoute);

app.post("/test", bodyParser.json(), async (req, res) => {
  console.log(req);
  res.json({ message: "Testing for body parser" });
});

app.get("/welcome", auth, (req, res) => {
  res.json({ message: "Testing for authentication" });
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
