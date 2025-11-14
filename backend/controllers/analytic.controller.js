import Order from "../models/order.model.js"
import Product from "../models/product.model.js"
import User from "../models/user.model.js"

export const getAnalyticsData=async()=>{

    try {
            const totaUsers=await User.countDocuments()
    const totaProducts=await Product.countDocuments()

    const salesData=await Order.aggregate([
        {
            $group:{
                _id:null,
                totalSales:{$sum:1},
                totalRevenue:{$sum:'$totalAmount'}
            }
        }
    ])

const {totalSales,totalRevenue}=salesData[0]||{totalSales:0,totalRevenue:0}

return {
    users:totaUsers,
    products:totaProducts,
    totalSales,
    totalRevenue
}
    } catch (error) {
        console.log('get analytics data function error',error.message)
        throw error
    }

}

export const getDailySalesData=async(startDate,endDate)=>{
    const dailySalesData=await Order.aggregate([
        {
            $match:{
                createdAt:{
                    $gte:startDate,
                    $lte:endDate
                }
            }

        },
        {
            $group:{
                _id:{$dateToString:{format:'%Y-%m-%d',date:'$createdAt'}},
                sales:{$sum:1},
                revenue:{$sum:'$totalAmount'}
            }
        },{
            $sort:{
                _id:1
            }
        }
    ])

    const dateArray=getDatesinRange(startDate,endDate)

    return dateArray.map(date=>{
            const foundDate=dailySalesData.find(item=>item._id===date)
            return{
                date,
                sales:foundDate?.sales ||0,
                revenue:foundDate?.revenue ||0
            }
    })

}

function getDatesinRange(startDate,endDate){
    const dates=[]
    let currentDate=new Date(startDate)

    while(currentDate<=endDate){
            dates.push(currentDate.toISOString().split('T')[0])
            currentDate.setDate(currentDate.getDate()+1)
    }
    return dates
}