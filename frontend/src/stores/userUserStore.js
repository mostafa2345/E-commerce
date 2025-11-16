import { create } from "zustand";
import axios from '../lib/axios'
import { log } from '../utils/logger'
import {toast} from 'react-hot-toast'





export const useUserStore=create((set,get)=>({
user:null,
loading:false,
checkingAuth:true,

signup:async({name,email,password,confirmPassword})=>{
    set({loading:true})
    if(password!==confirmPassword){
          set({loading:false})
      return  toast.error('Passwrod not match')
    }
    try {
        const res=await axios.post('/auth/register',{name,email,password})
        set({user:res.data,loading:false})

    } catch (error) {
          set({loading:false})
          toast.error(error.response.data.message||'An error occured')
    }

},
login:async(email,password)=>{
set({loading:true})
try {
    const res=await axios.post('/auth/login',{email,password})
    set({user:res.data,loading:false})
} catch (error) {
     set({loading:false})
          toast.error(error.response.data.message||'An error occured')
}
} ,



checkAuth:async()=>{
    set({checkingAuth:true})
    try {
        const res =await axios.get('/auth/profile')
       log('User profile response:', res.data)
        set({user:res.data,checkingAuth:false})
    } catch  {
        set({checkingAuth:false,user:null})
         
    }
},
logout:async()=>{
 
    try {
          await axios.post('/auth/logout')
             set({user:null,checkingAuth: false})
    } catch (error) {
        set({ checkingAuth: false }) 
          toast.error(error.response.data.message||'An error occured')
    }
  

},
refreshToken:async()=>{
    log('Starting token refresh')
    if(get().checkingAuth) return refreshPromise
   
    set({checkingAuth:true})
    try {
   const res= await axios.post('/auth/refresh-token')
   set({checkingAuth:false})
        log('User profile response:', res.data)
    return res.data
   
    } catch (error) {
        set({user:null,checkingAuth:false})
        throw error
    }
}
}))
let refreshPromise=null;
axios.interceptors.response.use(
    (res)=>res,
    async(error)=>{
        const originalRequest=error.config;
            if (originalRequest.url.includes("/auth/login")) {
      return Promise.reject(error);
    }
        if(error.response?.status===401 && !originalRequest._retry){
            originalRequest._retry=true
            try {
                if(!refreshPromise){
                    refreshPromise=useUserStore.getState().refreshToken()
                    
                }
                
                await refreshPromise
                refreshPromise=null
                return axios(originalRequest)
            } catch (refreshError) {
                useUserStore.getState().logout()
                return Promise.reject(refreshError)
            }

        }
        return Promise.reject(error)
    }
)
//TODO:Implement the axios interceptor for refreshing access token
 