const Job = require("../models/jobModel");

//Creating the controller for creating the jobs or internships

const createJob = async (req,res)=>{
    try {
        const {title,company,description,category,type,workMode,location,deadline,experienceLevel,applicationInstructions,salary,skills}= req.body;
         if(!title?.trim() || !company?.trim() || !description || !type || !location?.trim() || !deadline){
            return res.status(400).json({
                message:"All  the fied are required"
            })
         }


         if(!["job","internship"].includes(type)){
            return res.status(400).json({
                message:"Invalid opportunity type"
            })
         }
        if (Number.isNaN(Date.parse(deadline)) || new Date(deadline) <= new Date() ) {
          return res.status(400).json({
          message: "Enter a valid future deadline"
      });
    }
         const job = await Job.create({
            title,
            company,
            description,
            category,
            type,
            workMode,
            location,
            deadline,
            experienceLevel,
            applicationInstructions,
            salary,
            skills,
            postedBy:req.currentUser._id
         })

         return res.status(200).json({
            message:"Job created successfully",
            job
         })
    } catch (error) {
        console.log("Error in the job Creation ");

        return res.status(500).json({
            message:"Failed to create the job",
            error:error.message
        })
        
        
    }
}


//making the controller to get all the job list

const getAllJob = async (req,res)=>{
    try {
        const job = await Job.find().populate("postedBy","fullName email role profilepic").sort({createdAt:-1});

        if(!job){
            return res.status(400).json({
                message:"Job are not featched"
            })
        }

        return res.status(200).json({
            message:"All the jobs are fetched successfully",
            jobs:job
        })

    } catch (error) {
        console.log("Error in the getting the all jobpost");
        return res.status(500).json({
            message:"Failed to get the all Jobs"
        })
        
    }
}


//Making the controller to get the filtered job or intership

const getFilteredJob = async (req,res)=>{
    try {
        
        const {title,company,category,type,workMode,location,salary,skills} = req.query;
        const filterJob = {}

        if (title) {
            filterJob.title = { $regex: title, $options: "i" };
        }

        if (company) {
            filterJob.company = { $regex: company, $options: "i" };
        }

        if (category) {
            filterJob.category = { $regex: category, $options: "i" };
        }

        if (type) {
            filterJob.type = { $regex: type, $options: "i" };
        }

        if (workMode) {
            filterJob.workMode = { $regex: workMode, $options: "i" };
        }

        if (location) {
            filterJob.location = { $regex: location, $options: "i" };
        }

      
        if (salary) {
            filterJob.salary ={ $regex: salary, $options: "i" };
        }

        if (skills) {
            
            filterJob.skills = { $regex: skills, $options: "i" };
        }

        // Fetch matching jobs from the database
        const job = await Job.find(filterJob);

        return res.status(200).json({
            success: true,
            message: "Filtered jobs found successfully",
            count: job.length,
            job
        });

    }catch (error) {
        console.log("Error in filtered jobs");
        return res.status(500).json({
            message:"failed to get the filtered job",
            error:error.message
        })
        
        
    }
}

// Making the controller to get it own post 

const getOneJob = async (req,res)=>{
    try {
        const jobId = req.params.id;

        const job = await Job.find(jobId);

        if(!job){
            return res.status(400).json({
                message:"Job is not found"
            })
        }

        return res.status(200).json({
            message:"job fetch sucessfully",
            job
        })
    } catch (error) {
        console.log("Error in getting one post",error);
        return res.status(500).json({
            message:"Failed to get job",
            error:error.message
        })
        
    }
}

// Making the controller to get own job of professional

const getOwnjob = async (req,res)=>{
    try {
        const userId = req.user.userId;

    const job = await Job.find({postedBy:userId})
    .populate("postedBy","fullName role")
    .sort({createdAt:-1})
    
     if(!job){
        return res.status(400).json({
            message:"Job not found"
        })
     }

     return res.status(200).json({
        message:"job fetch successfully",
        count:job.length,
        job
     })
    } catch (error) {
        console.log("Error in geting Own professional job");
        return res.status(500).json({
            message:"Failed to get the job",
            error:error.message
        })
        
    }
}

//Making the controller to edit the own job post by professional

const editOwnJOb = async (req,res)=>{
    try {
        const userId = req.user.userId;
        const jobId = req.params.jobId;

        const {title,company,description,category,type,workMode,location,deadline,experienceLevel,applicationInstructions,salary,skills}= req.body;

        
         if(!title?.trim() || !company?.trim() || !description || !type || !location?.trim() || !deadline){
            return res.status(400).json({
                message:"All  the fied are required"
            })
         }
        
         const job = await Job.findById(jobId);
        
         if(!job){
            return res.status(400).json({
                message:"Job not found"
            })
         }

         if(job.postedBy.toString() !== userId.toString()){
            return res.status(400).json({
                message:"you have no authority ro update this job "
            })
         }

        job.title = title.trim();
        job.company = company.trim();
        job.description = description.trim();
        job.category = category;
        job.type = type;
        job.workMode = workMode;
        job.location = location.trim();
        job.deadline = deadline;
        job.experienceLevel = experienceLevel;
        job.applicationInstructions = applicationInstructions;
        job.salary = salary;
        job.skills = skills;

        const updatedJob = await job.save();

        return res.status(200).json({
            message:"job updated sucessfully",
            updatedJob
        })

       
    } catch (error) {
        console.log("Error in geting updating professional job");
        return res.status(500).json({
            message:"Failed to update the job",
            error:error.message
        })
        
    }
}

// Making the controller to delete the own post only by the professionaal

const deleteJob = async(req,res)=>{
    try {
        const userId = req.user.userId;
        const jobId = req.params.jobId;

        const job = await Job.findById(jobId);

        if(!job){
            return res.status(400).json({
                message:"Job not found"
            })
        }

        if(job.postedBy.toString() !== userId.toString()){
            return res.status(400).json({
                message:"You are not allowed to delete the post"
            })
        }

        await job.deleteOne();

        return res.status(200).json({
            message:"job deleted successfully"
        })
    } catch (error) {
         console.log("Error in deleting professional job");
        return res.status(500).json({
            message:"Failed to delete the job",
            error:error.message
        })
        
    }
}
module.exports = {createJob,getAllJob,getFilteredJob,getOneJob,getOwnjob,editOwnJOb,deleteJob};