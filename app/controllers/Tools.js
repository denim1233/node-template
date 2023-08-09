require("dotenv").config();
const winston = require("winston");
var nodemailer = require("nodemailer");
var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "lalibasser@gmail.com",
    pass: "xxxx",
  },
});

// multiple receiver
// var mailOptions = {
//     from: 'youremail@gmail.com',
//     to: 'myfriend@yahoo.com, myotherfriend@yahoo.com',
//     subject: 'Sending Email using Node.js',
//     text: 'That was easy!'
//   }

const options = {
  file: {
    level: "info",
    filename: "./storage/logs/app.log",
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false,
  },
  console: {
    level: "debug",
    handleExceptions: true,
    json: false,
    colorize: true,
  },
};

exports.createCookie = async (req, res) => {
  const cookieConfig = {
    httpOnly: true, // to disable accessing cookie via client side js
    //secure: true, // to force https (if you use it)
    maxAge: 1000000, // ttl in seconds (remove this option and cookie will die when browser is closed)
    signed: true, // if you use the secret with cookieParser
  };

  res.cookie("test3", "test cookie hidden", cookieConfig);
  res.send("set cookie");
};

exports.getCookie = async (req, res) => {
  const signedCookies = req.signedCookies; // get signed cookies
  console.log("signed-cookies:", signedCookies);
  const cookies = req.cookies["test3"]; // get not signed cookies
  console.log("not-signed-cookies:", cookies);

  // or access directly to one cookie by its name :
  const myTestCookie = req.signedCookies;
  console.log("our test signed cookie:", myTestCookie);
  res.send("get cookie");
};

// how to use?
// logger.info()
// logger.error()
exports.logger = winston.createLogger({
  levels: winston.config.npm.levels,
  transports: [
    new winston.transports.File(options.file),
    new winston.transports.Console(options.console),
  ],
  exitOnError: false,
});

const jwt = require("jsonwebtoken");
//create jwt token
exports.createToken = async (req, res) => {
  console.log(req.headers);
  const token = jwt.sign(
    { user_id: 2, email: "testmail@mail.com" },
    process.env.TOKEN_KEY,
    {
      expiresIn: "2h",
    }
  );
  // res.status(201).json(token);

  res.send({ status: "success", token: token });
};

var mailOptions = {
  from: "lalibasser@gmail.com",
  to: "iamic.dev@gmail.com",
  subject: "Sending Email using Node.js",
  text: "That was easy!",
};

exports.generateMail = () => {
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

exports.exportExcel = async (req, res) => {
  const xl = require("excel4node");
  const wb = new xl.Workbook();
  const ws = wb.addWorksheet("Worksheet Name");
  const data = [
    {
      name: "Shadab Shaikh",
      email: "shadab@gmail.com",
      mobile: "1234567890",
    },
  ];

  //set the header here
  const headingColumnNames = ["Name", "Email", "Mobile"]; //Write Column Title in Excel file

  let headingColumnIndex = 1;
  headingColumnNames.forEach((heading) => {
    ws.cell(1, headingColumnIndex++).string(heading);
  }); //Write Data in Excel file
  let rowIndex = 2;
  data.forEach((record) => {
    let columnIndex = 1;
    Object.keys(record).forEach((columnName) => {
      ws.cell(rowIndex, columnIndex++).string(record[columnName]);
    });
    rowIndex++;
  });
  try {
    // wb.write(`${path}/data.xlsx`);
    wb.write(`storage/files/data.xlsx`);
    res.send({
      message: "User created successfully!!",
      user: data,
    });
  } catch (err) {
    console.log(err);
    res.send({ status: "error", message: err });
  }
};

exports.downloadFile = async (req, res) => {
  try {
    // just add the parameter of file name to download
    const file = `storage/files/data.xlsx`;
    res.download(file); // Set disposition and send it.
    // file will not downoad if you add an response string in front end
  } catch (err) {
    console.log(err);
    res.send({ status: "error", message: err });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    let user = await User.findOne({ email: username });
    req.session.userId = user.id;

    console.log(req.session);

    res.redirect("/dashboard");
  } catch (err) {
    console.log(err);
    res.json({ msg: "Server Error! Please reload page" });
  }
};
