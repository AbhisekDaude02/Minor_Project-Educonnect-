const express = require("express");
const authMiddleware = require("../middlewares/authmiddleware");
const { applyJob, getOwnJobApplication, getApplicant, updateStatus } = require("../controllers/jobApplicationController");
const allowRoles = require("../middlewares/roleMiddleware");
const pdfUpload = require("../middlewares/pdfUpload");

const router = express.Router()

router.post("/applyjob/:jobId",authMiddleware,allowRoles("student"),pdfUpload.single("resume"), applyJob);
router.get("/myjob",authMiddleware,allowRoles("student"),getOwnJobApplication);
router.get("/job/:jobId",authMiddleware,allowRoles("professional"),getApplicant);
router.patch("/updatestatus/:applicationId/status",authMiddleware,allowRoles("professional"),updateStatus)

module.exports = router;