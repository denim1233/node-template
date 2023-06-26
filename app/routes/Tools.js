const express = require("express");
const ToolsController = require("../controllers/Tools");
const router = express.Router();
const bodyParser = require("body-parser");
router.get("/send-email", ToolsController.generateMail);
router.get("/export-excel", ToolsController.exportExcel);
router.get("/download-file", ToolsController.downloadFile);
router.get("/getToken", ToolsController.createToken);
router.get("/getCookie", ToolsController.getCookie);
router.get("/createCookie", bodyParser.json(), ToolsController.createCookie);

module.exports = router;
