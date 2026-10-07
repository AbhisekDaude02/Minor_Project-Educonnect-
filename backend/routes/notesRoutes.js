const express = require("express");
const pdfUpload = require("../middlewares/pdfUpload");
const { uploadNotes, getAllNotes, searchNotes, deleteNotes, downloadNote, previewNote } = require("../controllers/notesController");
const authmiddleware = require("../middlewares/authmiddleware")

const router = express.Router();

router.post("/uploadnote",authmiddleware,pdfUpload.single("pdf"),uploadNotes);
router.get("/getallnotes",authmiddleware,getAllNotes);
router.get("/searchnotes",authmiddleware,searchNotes);
router.delete("/deletenotes/:id",authmiddleware,deleteNotes);
router.get("/download/:id",authmiddleware,downloadNote);
router.get("/preview/:id",authmiddleware,previewNote);


module.exports = router;