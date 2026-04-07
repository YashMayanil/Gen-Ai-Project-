import axios from "axios"

// this is axios instance means you dont need to put api 10 times just put api name there 
const api = axios.create({
    baseURL:"http://localhost:3000",
    withCredentials:true
})

export async function register({username,email,password}) {
    try{
        //so without writing this all code 
        // const response = await axios.post('/http://localhost:3000/api/auth/register',{
        //     username,email,password
        // },{
        //     withCredentials:true, //acess to the server to interact with cookies
        // })

        // we can write only now 
        const response = await api.post('/api/auth/register',{
            username,email,password
        })

        return response.data;

    }catch(error){
        console.log(error);
    }
}

export async function login({email,password}){
    try {
        const response = await api.post("/api/auth/login",{
            email,password
        })

      return response.data
    } catch (error) {
        console.log(error)
    }
}

export async function logout(){
    try {
        
        const response = await api.get("/api/auth/logout")
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

export async function getme(){
    try {
        
        const response = await api.get("/api/auth/get-me")
        return response.data;
    } catch (error) {
        console.log(error)
    }
}