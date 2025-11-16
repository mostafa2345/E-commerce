import { useState } from "react"
import { motion } from "framer-motion";
import { Loader, PlusCircle, Upload } from "lucide-react";
import { useProductStore } from '../stores/useProductStore';
import { log } from '../utils/logger';
import toast from "react-hot-toast";


const categories = ["jeans", "t-shirts", "shoes", "glasses", "jackets", "suits", "bags"];
const CreateProduct = () => {

      const[newProduct,setNewProduct]=useState({
      	name: "",
		description: "",
		price: "",
		category: "",
		image: "",
  
      })
      const {loading,addProduct}=useProductStore()
      const handleImageChange=(e)=>{
        
        const file=e.target.files[0]
        log('Selected file:', file.name, 'size:', (file.size / 1024).toFixed(2), 'KB')
      
        if(file){
          const reader=new FileReader()

          reader.onloadend=()=>{
            setNewProduct({...newProduct,image:reader.result})
          }
          reader.readAsDataURL(file)
        }

      }
      const handleSubmit=async(e)=>{
        	e.preventDefault()
        if(newProduct.image===''){
          toast.error('youshould add image',{id:'img'})
          return

        }
        try {
         await addProduct(newProduct)
         setNewProduct({ name: "", description: "", price: "", category: "", image: "" });
        } catch(error)  {
          log('Error creating product:', error.message);
        }
       

      }
  return (
    <motion.div className="bg-gray-800 shadow-lg rounded-lg p-8 mb-8 max-w-xl mx-auto"
    initial={{opacity:0,y:20}}
    animate={{opacity:1,y:0}}
    transition={{duration:0.8}}
    >
      <h2 className='text-2xl font-semibold mb-6 text-emerald-300'>Create New Product</h2>

      <form className=" space-y-4" onSubmit={handleSubmit} >
      	<div>
				<label htmlFor="name" className='block text-sm font-medium text-gray-300'>
          Product Name
        </label>
        <input type="text"
         id="name"
         name="name"
         value={newProduct.name}
         onChange={(e)=>setNewProduct({...newProduct,name:e.target.value})}
         required
         	className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2
						 px-3 text-white focus:outline-none focus:ring-2
						focus:ring-emerald-500 focus:border-emerald-500'
        
        />
				</div>
        <div>
          <label htmlFor="description" className='block text-sm font-medium text-gray-300'>
            Description
          </label>
          <textarea 
          id="description"
          name="description"
          rows='3'
          required
          value={newProduct.description}
          onChange={(e)=>setNewProduct({...newProduct,description:e.target.value})}
          
          	className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2
						 px-3 text-white focus:outline-none focus:ring-2
						focus:ring-emerald-500 focus:border-emerald-500'
          />
        </div>

        		<div>
					<label htmlFor='price' className='block text-sm font-medium text-gray-300'>
						Price
					</label>
					<input
						type='number'
						id='price'
						name='price'
						value={newProduct.price}
						onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
						step='0.01'
						className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm 
						py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500
						 focus:border-emerald-500'
						required
					/>
				</div>
        <div>
          	<label htmlFor='category' className='block text-sm font-medium text-gray-300'>
						Category
					</label>
          <select 
          	id='category'
						name='category'
						value={newProduct.category}
						onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
						className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md
						 shadow-sm py-2 px-3 text-white focus:outline-none 
						 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
						required
          
          >
            <option value="">Select Category</option>
            {categories.map((category)=>(
              <option key={category} value={category}>{category}</option>
            ))}

          </select>
        </div>
        <div>
          <input type="file" id="image" className=" sr-only" accept="image/*" onChange={handleImageChange}/>
          	<label
						htmlFor='image'
						className='cursor-pointer bg-gray-700 py-2 px-3 border border-gray-600 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500'
					>
						<Upload className='h-5 w-5 inline-block mr-2' />
						Upload Image
					</label>
          	{newProduct.image && <span className='ml-3 text-sm text-gray-400'>Image uploaded </span>}
        </div>

        <button type="submit" disabled={loading} className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md 
					shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 
					focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50'>
            {loading?(
              <>
              <Loader className='mr-2 h-5 w-5 animate-spin' aria-hidden='true' />
              Loading...
              </>

            ):(
              <>
              <PlusCircle className='mr-2 h-5 w-5' />
              Create Product
              </>
            )

            }

        </button>


      </form>

    </motion.div>
  )
}
export default CreateProduct