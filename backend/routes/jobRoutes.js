const express = require("express");
const {createJob,getAllJob, getFilteredJob, getOneJob, getOwnjob, editOwnJOb, deleteJob} = require("../controllers/jobController");
const authMiddleware = require("../middlewares/authmiddleware");
const allowRoles = require("../middlewares/roleMiddleware")

const router = express.Router();

router.post("/postjob",authMiddleware,allowRoles("professional"),createJob);
router.get("/getalljob",authMiddleware, getAllJob);
router.get("/getfilterjob",authMiddleware,getFilteredJob);
router.get("/getonejob/:jobId",authMiddleware,getOneJob);
router.get("/getownjob",authMiddleware,getOwnjob);
router.put("/updatejob/:jobId",authMiddleware,allowRoles("professional"),editOwnJOb);
router.delete("/deletejob/:jobId",authMiddleware,allowRoles("professional"),deleteJob);
module.exports = router;