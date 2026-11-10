import { Children, useContext, useState } from "react";

export const JobContext = useContext();

export const JobProvider = ({children})=>{
    const [job,setJob]= useState([])
    return <JobContext.provider value={{job,setJob}}>{children}</JobContext.provider>
}