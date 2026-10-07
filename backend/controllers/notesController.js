const Notes = require("../models/notesModel");
const {cloudinary} = require("../utils/cloudinary");

const uploadNotes = async (req,res)=>{
    try {
        const { title,subject,university,program,semester,noteType,description}=req.body;

        if(!req.file){
            return res.status(400).json({
                message:"file does not uploaded"
            })
        };
        console.log("FILE:", req.file);
        if(!title || !subject || !university || !program || !semester){
            return res.status(400).json({
                message:"provide all required field"
            })
        }
        
        //Converting the PDF buffer into Base64 data URI
        const fileData = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

        //Upload to the cloudinary
        const result = await cloudinary.uploader.upload(fileData,
             { 
                folder: "educonnect/notes", 
                resource_type: "raw"
             });

             const note = await Notes.create({
                title,
                subject,
                university,
                program,
                semester,
                noteType:noteType || "Note",
                description,
                pdfUrl:result.secure_url,
                publicId:result.public_id,
                uploadedby:req.user.userId

             });

             return res.status(200).json({
                message:"Note uploaded successfully",
                note
             })
    } catch (error) {
        console.log("Error in uploading notepdf",error);
        return res.status(500).json({
            message:"failed to upload the notes",
            error:error.message
        })
        
        
    }
}

//Making the controller to get the all notes

const getAllNotes = async(req,res)=>{
    try {
        const notes = await Notes.find()
        .populate("uploadedby","fullName email role profilepic")
        .sort({createdAt:-1})

        return res.status(200).json({
            message:"All the notes are featch successsfully",
            notes
        })
    } catch (error) {
        console.log("Error in getting all notes",error);
        return res.status(500).json({
            message:"Failed to get all notes",
            error:error.message
        })
    }
}

// Making controller to delete the own note

const deleteNotes = async (req,res)=>{
    try {
        const userId = req.user.userId;
        const noteId = req.params.id;

        const note = await Notes.findById(noteId);

        if(!note){
            return res.status(400).json({
                message:"note not found"
            })
        }

        //Note owner only delete the note

        if(note.uploadedby.toString()!== userId){
            return res.status(400).json({
                message:"Your are not allowed to delete the node"
            })
        }

    await cloudinary.uploader.destroy(note.publicId,{resource_type:"raw"});

    await Notes.findByIdAndDelete(noteId);
    res.status(200).json({
        message:"Note deleted successfully"
    })
    } catch (error) {
        console.log("Error in deleting the notes",error);

        return res.status(500).json({
            message:"Failed to delete the note"
        })
        
    }
}

//Making the controler to filter the notes
const searchNotes = async (req, res) => {
    try {
        const {subject,university,program,semester,noteType} = req.query;

        const filter = {};

        if (subject) {
            filter.subject = {
                $regex: subject,
                $options: "i"
            };
        }

        if (university) {
            filter.university = {
                $regex: university,
                $options: "i"
            };
        }

        if (program) {
            filter.program = {
                $regex: program,
                $options: "i"
            };
        }

        if (semester) {
            filter.semester = {
                $regex: semester,
                $options: "i"
            };
        }

        if (noteType) {
            filter.noteType = noteType;
        }

        const notes = await Notes.find(filter)
            .populate("uploadedby", "fullName email role profilepic")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            message: "Notes searched successfully",
            notes
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Failed to search notes",
            error: error.message
        });
    }
};
//making the controller to download the 
const downloadNote = async (req, res) => {
    try {
        const noteId = req.params.id;

        
        const note = await Notes.findById(noteId);

        if (!note) {
            return res.status(404).json({
                message: "Note not found"
            });
        }

       
        if (!note.pdfUrl) {
            return res.status(404).json({
                message: "PDF file not found"
            });
        }

        
        const response = await fetch(note.pdfUrl);

        if (!response.ok) {
            return res.status(500).json({
                message: "Failed to fetch PDF from Cloudinary"
            });
        }

        
        const pdfBuffer = Buffer.from(await response.arrayBuffer());

        
        const fileName = `${note.title}.pdf`.replace(/[^a-zA-Z0-9._-]/g,"_");

        
        res.setHeader("Content-Type","application/pdf");

        res.setHeader("Content-Disposition",`attachment; filename="${fileName}"`);

        res.setHeader("Content-Length",pdfBuffer.length);

        
        return res.send(pdfBuffer);

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Failed to download note",
            error: error.message
        });
    }
};

//making the controller for preview
const previewNote = async (req, res) => {
    try {
        const noteId = req.params.id;

        const note = await Notes.findById(noteId);

        if (!note) {
            return res.status(404).json({
                message: "Note not found"
            });
        }

        if (!note.pdfUrl) {
            return res.status(404).json({
                message: "PDF file not found"
            });
        }

        const response = await fetch(note.pdfUrl);

        if (!response.ok) {
            return res.status(500).json({
                message: "Failed to fetch PDF from Cloudinary"
            });
        }

        const pdfBuffer = Buffer.from(
            await response.arrayBuffer()
        );

        res.setHeader("Content-Type", "application/pdf");

        // IMPORTANT: inline means open in browser
        res.setHeader(
            "Content-Disposition",
            "inline"
        );

        res.setHeader(
            "Content-Length",
            pdfBuffer.length
        );

        return res.send(pdfBuffer);

    } catch (error) {
        console.log("Preview error:", error);

        return res.status(500).json({
            message: "Failed to preview note",
            error: error.message
        });
    }
};

module.exports = {uploadNotes,getAllNotes,deleteNotes,searchNotes,downloadNote,previewNote}