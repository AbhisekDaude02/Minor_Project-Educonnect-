const router = require("express").Router();
const { auth, requireRole } = require("../middleware/auth");
const c = require("../controllers/controller");

router.get("/", auth, c.listOpportunities);
router.get("/internships", auth, (req, res, next) => { req.query.type = "Internship"; next(); }, c.listOpportunities);
router.get("/jobs", auth, (req, res, next) => { req.query.type = "Job"; next(); }, c.listOpportunities);
router.get("/mine", auth, requireRole("Professional"), c.listMyOpportunities);
router.get("/applications/mine", auth, requireRole("Student"), c.listMyApplications);
router.get("/:id", auth, c.getOpportunity);
router.post("/", auth, requireRole("Professional"), c.createOpportunity);
router.put("/:id", auth, requireRole("Professional"), c.updateOpportunity);
router.delete("/:id", auth, requireRole("Professional"), c.deleteOpportunity);
router.post("/:id/apply", auth, requireRole("Student"), c.applyToOpportunity);
router.patch("/:jobId/applications/:applicationId", auth, requireRole("Professional"), c.updateApplication);
module.exports = router;
