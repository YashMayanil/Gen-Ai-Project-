import { useContext } from "react";
import { AuthContext } from "../auth.context";
import {login,register,getme,logout} from "../services/auth.api.js"

export const useAuth = () => {

    const constext = useContext(AuthContext);
    const {user,setUser,loading,setLoading} = context

    const handleLogin = async ({email,passowrd})=>{
        
    }
}