const UserModel = require("../model/user");
const StatusModel = require("../model/status");
const UserTypeModel = require("../model/userType");

//inner join
// var statusSchema = mongoose.Schema({
//   user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//   addTime: Date,
// });

// var userTypeSchema = mongoose.Schema({
//   user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//   addTime: Date,
// });

// Create and Save a new user
exports.register = async (req, res) => {
  // Our register logic starts here
  try {
    // Get user input
    const { first_name, last_name, email, password } = req.body;

    // Validate user input
    if (!(email && password && first_name && last_name)) {
      res.status(400).send("All input is required");
    }

    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }

    //Encrypt user password
    encryptedPassword = await bcrypt.hash(password, 10);

    // Create user in our database
    const user = await User.create({
      first_name,
      last_name,
      email: email.toLowerCase(), // sanitize: convert email to lowercase
      password: encryptedPassword,
    });

    // Create token
    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.TOKEN_KEY,
      {
        expiresIn: "2h",
      }
    );
    // save user token
    user.token = token;

    // return new user
    res.status(201).json(user);
  } catch (err) {
    console.log(err);
  }
};

exports.login = async (req, res) => {
  try {
    // Get user input
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      res.status(400).send("All input is required");
    }
    // Validate if user exist in our database
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );

      // save user token
      user.token = token;

      // user
      res.status(200).json(user);
    }
    res.status(400).send("Invalid Credentials");
  } catch (err) {
    console.log(err);
  }
};
exports.create = async (req, res) => {
  if (
    !req.body.email &&
    !req.body.firstName &&
    !req.body.lastName &&
    !req.body.phone
  ) {
    res.status(400).send({ message: "Content can not be empty!" });
  }

  const user = new UserModel({
    email: req.body.email,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    phone: req.body.phone,
  });

  await user
    .save()
    .then((data) => {
      res.send({
        message: "User created successfully!!",
        user: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating user",
      });
    });
};

// Retrieve all users from the database.

//subquery
//innner join

exports.findAll = async (req, res) => {
  try {
    // this is the format equivalent of like in mysql
    // /parameter/
    // { firstName: /2/ }
    const user = await UserModel.find()
      // .populate("status")
      // .populate("userType")
      // .populate("status")
      // .where("firstName")
      // .equals("name")
      .limit(10)
      .sort([
        ["firstName", "descending"],
        ["lastName", "ascending"],
      ]);
    // Teacher.findOne({ _id: req.params.teacherId })
    //   .populate({
    //     path: "students",
    //     populate: {
    //       path: "courses",
    //     },
    //   })
    //   .exec(function (err, docs) {});

    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Find a single User with an id
exports.findOne = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Update a user by the id in the request
exports.update = async (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Data to update can not be empty!",
    });
  }

  const id = req.params.id;

  await UserModel.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `User not found.`,
        });
      } else {
        res.send({ message: "User updated successfully." });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};

// Delete a user with the specified id in the request
exports.destroy = async (req, res) => {
  await UserModel.findByIdAndRemove(req.params.id)
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `User not found.`,
        });
      } else {
        res.send({
          message: "User deleted successfully!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};
