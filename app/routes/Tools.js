const express = require("express");
const ToolsController = require("../controllers/Tools");
const router = express.Router();

router.get("/send-email", ToolsController.generateMail);
router.get("/export-excel", ToolsController.exportExcel);
router.get("/download-file", ToolsController.downloadFile);
router.get("/getToken", ToolsController.createToken);

module.exports = router;
