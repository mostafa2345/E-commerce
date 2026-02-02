import React from "react";
import { useGetProductByIdQuery } from "../stores/api/productApi";
import { useParams } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import { Error } from "@mui/icons-material";
import { Box } from "lucide-react";
import { Paper, Typography } from "@mui/material";
import Product from "../components/Product";

const ProductPage = () => {
    const {id}=useParams()
   
    const {data:product,isFetching,error}=useGetProductByIdQuery(id)
  console.log(product);
  if(isFetching){
    return <LoadingSpinner/>
  }
if (error) {
  return (
    <Paper className="flex items-center justify-center h-screen">
        
      <Typography color="error">Something went wrong</Typography>
      <Error />
    </Paper>
  );
}
  
 return (
   <div className="flex justify-center">
     <Product product={product} />
   </div>
 );
};

export default ProductPage;
