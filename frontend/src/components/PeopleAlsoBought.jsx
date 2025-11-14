import { useEffect, useState } from "react"
import axiosInstance from "../lib/axios"
import toast from "react-hot-toast"
import LoadingSpinner from "./LoadingSpinner"
import Product from "../components/Product"

const PeopleAlsoBought = () => {
    const[recommendations,setRecommendations]=useState([])
    const[isLoading,setIsloading]=useState(true)

    useEffect(()=>{
        const fetchRecommendations=async()=>{
            try {
                const res=await axiosInstance.get('/products/recommendations')
                console.log(res)
                setRecommendations(res.data)
            } catch (error) {
                toast.error(error.response.data.message || "An error occurred while fetching recommendations");
            }finally{
                    setIsloading(false);
            }

        }
        fetchRecommendations()
    },[])
    if(isLoading) return <LoadingSpinner/>
  return (
    	<div className='mt-8'>
			<h3 className='text-2xl font-semibold text-emerald-400'>People also bought</h3>
			<div className='mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg: grid-col-3'>
				{recommendations.map((product) => (
					<Product key={product._id} product={product} />
				))}
			</div>
		</div>
  )
}
export default PeopleAlsoBought