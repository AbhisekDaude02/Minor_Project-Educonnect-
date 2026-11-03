import API from "../api/axios"

export const getAllJob = ()=>{
return API.get("/job/getalljob") 
}