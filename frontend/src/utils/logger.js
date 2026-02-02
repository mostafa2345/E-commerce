const isDev=import.meta.env.NODE_ENV==='development'

export const log=(...args)=>{
if(isDev){
    console.log(...args)
}
}