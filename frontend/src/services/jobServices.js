
import API from "../api/axios";

// Create job or internship
export const uploadJob = (formData) => {
  return API.post("/job/postjob", formData);
};

// Get all jobs
export const getAllJob = () => {
  return API.get("/job/getalljob");
};

// Get logged-in professional's jobs
export const getOwnjob = () => {
  return API.get("/job/getownjob");
};

// Update an existing job
export const editOwnJob = (jobId, jobData) => {
  return API.put(`/job/updatejob/${jobId}`, jobData);
};

// Delete an existing job
export const deleteOwnJob = (jobId) => {
  return API.delete(`/job/deletejob/${jobId}`);
};

//Making the endpoint for the APPly to the jobs

export const applyForJob = (jobId,data)=>{
  return API.post(`/applyjob/jobapply/${jobId}`,data);
}
export const getMyApplications = () => {
  return API.get("/applyjob/myjob");
};