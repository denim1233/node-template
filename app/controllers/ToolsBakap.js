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
  // console.log(wb);
  const path = "./storage/files";
  try {
    const data = await wb.write(`${path}/data2.xlsx`).then(() => {
      res.send({
        status: "success",
        message: "file successfully downloaded",
        path: `${path}/data.xlsx`,
      });
    });
  } catch (err) {
    res.send({ status: "error", message: err });
  }
};
