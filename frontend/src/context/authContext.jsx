import { Children, createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({children})=>{
    const [isLogging,setIsLogging]=useState(false);
    const [isLogout,setIsLogout] = useState(false);

    return <AuthContext.Provider value={{isLogging,setIsLogging,isLogout,setIsLogout}}>{children}</AuthContext.Provider>

}