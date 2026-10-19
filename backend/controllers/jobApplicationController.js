const Job = require("../models/jobModel");
const jobApplication = require("../models/jobApplicationModel");
const { cloudinary } = require("../utils/cloudinary");
const JobApplication = require("../models/jobApplicationModel");

// Making the controller to apply for the job or intership

const applyJob = async (req,res)=>{
    try {

        const {coverLetter} = req.body;
        const userId = req.user.userId;
        const jobId = req.params.jobId;

        
     if(!req.file){
        return res.status(400).json({
            message:"File not uploaded select the resume file"
        })
     }

     if(!coverLetter){
        return res.status(400).json({
            message:"CoverLetter is required"
        })
     }
      const job = await Job.findById(jobId);

      if(!job){
        return res.status(400).json({
            message:"Job not found"
        })
      }

      if(job.status !== "Open"){
        return res.status(400).json({
            message:"job is closed"
        })
      }

      if(job.deadline && new Date() > new Date(job.deadline)){
        return res.status(400).json({
            message:"The application is close"
        })
      }

      const existingApplicant = await jobApplication.findOne({
        job:jobId,
        applicant:userId
      });

      if(existingApplicant){
        return res.status(400).json({
            message:"You have already apply for the this job"
        })
      }

      if(job.postedBy.toString() === userId.toString()){
        return res.status(400).json({
            message:"You are cannot apply to your own job post"
        })
      }

       const uploadResult = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: "educonnect/resumes",
                    resource_type: "raw",
                    public_id: `resume-${userId}-${Date.now()}.pdf`
                },
                (error, result) => {
                    if (error) {
                        return reject(error);
                    }

                    resolve(result);
                }
            );

            uploadStream.end(req.file.buffer);
        });


        const application = await jobApplication.create({
            job: jobId,
            applicant: userId,
            coverLetter: coverLetter.trim(),
            resumeUrl: uploadResult.secure_url,
            status: "pending"
        });

  
        const savedApplication = await jobApplication.findById(application._id)
            .populate("applicant", "fullName email role profilepic")
            .populate("job", "title company");

        return res.status(201).json({
            message: "Application submitted successfully",
            application: savedApplication
        });

    } catch (error) {
        console.log("Error in applying the job",error);

        return res.status(500).json({
            message:"Failed to apply for the job",
            error:error.message
        })
        
    }
}


// Making the controller to get the student own jobapplication

const getOwnJobApplication = async (req,res)=>{
    try {
        const userId = req.user.userId;
        const jobApplication = await JobApplication.findOne({applicant:userId});

        if(!jobApplication){
            return res.status(400).json({
                message:"job application  not found"
            })
        }

        return res.status(200).json({
            message:"You Job appplication found successfully",
            jobApplication
        })
    } catch (error) {
       console.log("Error in the getting own job application");

       return res.status(500).json({
        message:"Failed to find the you job applicatio",
        error:error.message
       })
        
    }
}

// Making the controller to get the job application of the applicant by professional

const getApplicant = async (req, res) => {
    try {
        const { jobId } = req.params;
        const userId = req.user.userId;

        if (!jobId) {
            return res.status(400).json({
                message: "Job ID is required"
            });
        }

        // First, check whether the job exists
        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({
                message: "Job does not exist"
            });
        }


        // Check whether the logged-in user owns this job
        if (job.postedBy.toString() !== userId.toString()) {
            return res.status(403).json({
                message: "You are not authorized to view applicants for this job"
            });
        }

        // Find ALL applications for this job
        const jobApplicants = await JobApplication.find({
            job: jobId
        })
            .populate("applicant", "fullName email role profilepic")
            .populate("job", "title company")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            message: "Job applicants retrieved successfully",
            totalApplicants: jobApplicants.length,
            jobApplicants
        });

    } catch (error) {
        console.log("Error getting job applicants:", error);

        return res.status(500).json({
            message: "Failed to get job applicants",
            error: error.message
        });
    }
};

// making the controller to change the statu of the applicant

const updateStatus = async (req,res)=>{
    try {
        const {applicationId} = req.params;
        const{status} = req.body;

        if(!applicationId){
            return res.status(400).json({
                message:"Invalid applicationId"
            })
        };

        const allowedStatus = ["pending","selected","rejected","shortlisted"];

        if(!allowedStatus.includes(status)){
            return res.status(400).json({
                message:"status must contained pending,selected,rejected,shortlisted"
            })
        }

        const application = await JobApplication.findById(applicationId);

        if(!application){
            return res.status(400).json({
                message:"application not found"
            })
        }

        const job = await Job.findOne({
            _id:application.job,
            postedBy:req.user.userId
        })

        if(!job){
          return res.status(400).json({
            message:"You cannot manage this application"

          })
        }

        application.status = status;

     const updatedStatus = await application.save();

     return res.status(200).json({
        message:"Status of the applicant updated successfull",
        updatedStatus
     })

    } catch (error) {
        console.log("Error in the updating the status");
        return res.status(500).json({
            message:"Failed to update the status",
            error:error.message
        })
        
    }
}
module.exports = {applyJob,getOwnJobApplication,getApplicant,updateStatus};