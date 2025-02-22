const express = require("express");
const { submitReport, allReports, userReports, updateResolved, updateStatus } = require("../controllers/reportController");
const validateToken = require("../middlewares/validateToken");
const upload = require("../middlewares/imagedb");


const router = express.Router();

router.post("/submit", upload.single("image"), validateToken, submitReport);

router.get("/fetch", validateToken, allReports);

router.get("/user", validateToken, userReports);

router.patch("/:id/accept", validateToken, updateStatus);

router.patch("/:id/resolve", validateToken, updateResolved);


module.exports = router;