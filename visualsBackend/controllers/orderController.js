import orderModel from "../models/orderModel.js"
import userModel from "../models/userModel.js"
import razorpay from 'razorpay'

const currency='inr'
const deliveryCharge=10


//gateway initialize
const razorpayInstance=new razorpay({
    key_id:process.env.RAZORPAY_KEY_ID,
    key_secret:process.env.RAZORPAY_KEY_SECRET
})

const placeOrder = async (req, res) => {
    try {
        const { userId, items, amount, address} = req.body
        const orderData = {
            userId,
            items,
            amount,
            address,
            paymentMethod: "COD",
            payment: false,
            date: Date.now()
        }
        const newOrder = new orderModel(orderData)
        await newOrder.save()

        await userModel.findByIdAndUpdate(userId, {cartData: {}})

        res.json({success: true, message: "Order Placed"})
    }
    catch (error){
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

// Placing orders using stripe method
const placeOrderStripe = async (req, res) => {

}

// Placing orders using Razorpay method
const placeOrderRazorpay = async (req, res) => {
    try {
        const { userId, items, amount, address} = req.body
        const orderData = {
            userId,
            items,
            amount,
            address,
            paymentMethod: "Razorpay",
            payment: false,
            date: Date.now()
        }
        const newOrder = new orderModel(orderData)
        await newOrder.save()

        const options={
            amount:amount*100,
            currency:currency.toUpperCase(),
            receipt:newOrder._id.toString()
        }

        await razorpayInstance.orders.create(options,(error,order)=>{
            if(error){
                console.log(error)
                return res.json({success:false,message:error})
            }
            res.json({success:true,order})
        }) 
    } catch (error) {
        console.log(error)
        return res.json({success:false,message:error.message})
        
    }

}
const verifyRazorpay=async (req,res)=>{
    try {
        const {userId,razorpay_order_id}=req.body
        const orderInfo=await razorpayInstance.orders.fetch(razorpay_order_id)
        if(orderInfo.status === 'paid'){
            await orderModel.findByIdAndUpdate(orderInfo.receipt,{payment:true});
            await userModel.findByIdAndUpdate(userId,{cartData:{}})
            res.json({success:true,message:"payment successful"})
        }else{
            res.json({success:false,message:'Payment failed'})
        }
        
    } catch (error) {
        console.log(error)
        return res.json({success:false,message:error.message})
  
    }
}

// All orders data for admin panel
const allOrders = async (req, res) => {
    try{
        const orders = await orderModel.find({})
        res.json({success: true, orders})
    }
    catch(error){
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

// User order data for frontend
const userOrders = async (req, res) => {
    try{
        const {userId} = req.body
        const orders = await orderModel.find({userId})
        res.json({success: true, orders})
    }
    catch (error){
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

// Update order status
const updateStatus = async (req, res) => {
    try{
        const {orderId, status} = req.body
        await orderModel.findByIdAndUpdate(orderId, {status})
        res.json({success: true, message: "Order Status Updated"})
    }
    catch (error){
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

export {verifyRazorpay,placeOrder, placeOrderRazorpay, placeOrderStripe, allOrders, updateStatus, userOrders}