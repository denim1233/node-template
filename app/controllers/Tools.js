var nodemailer = require("nodemailer");

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "lalibasser@gmail.com",
    pass: "gszbtxcvswvmbetw",
  },
});

// multiple receiver
// var mailOptions = {
//     from: 'youremail@gmail.com',
//     to: 'myfriend@yahoo.com, myotherfriend@yahoo.com',
//     subject: 'Sending Email using Node.js',
//     text: 'That was easy!'
//   }

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

exports.createLog = async = () => {};
