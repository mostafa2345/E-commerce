import Order from '../models/order.model.js'

export async function generateOrderNumber() {

    const today=new Date()
    const datePart=today.toISOString().slice(0,10).replace(/-/g,'')

    const count =await Order.countDocuments({
        createdAt:{
            $gte:new Date(today.setHours(0,0,0,0)),

            $lt:new Date(today.setHours(23,59,59,999))
        }
    })

    const sequence =String(count+1).padStart(3,'0')

    return `ORD-${datePart}-${sequence}`
    
}