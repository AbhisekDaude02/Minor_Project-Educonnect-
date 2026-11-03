import API from "../api/axios"

 export const userRegister = (userData)=>{
    return API.post("/auth/userregister",userData);
}

export const userLogin = (credentials)=>{
    return API.post("/auth/userlogin",credentials)
}

export const userLogout = ()=>{
    return API.post("/auth/userlogout")
}

export const getLoggedUser = ()=>{
    return API.get("/auth/getloginuser")
}