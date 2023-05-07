import { Order } from "../Models/Order.js";
import { Product } from "../Models/Product.js";

class historyController{
    //get orders
    async getOrders (req,res,next){
        const {start,end} = req.query;
        
        let lastTimeOfDayEnd = new Date(end)
        lastTimeOfDayEnd.setHours(23,59,59,999)
        

        Order.find(start && end ? { 
          created_at:{
            $gte: new Date(start),
            $lt: lastTimeOfDayEnd
          }} : {})
        .sort({ _id: -1 })
        .populate({path : 'owenId',select : '_id firstName lastName image role gender'})
        .populate({path : 'orders.productId' , select: '-listOptions'})
        .then((data) => res.json(data))
        .catch((err) => res.json(err))
  }
    
    //create order
    async createOrder (req,res,next){
        const {optionPayment,orders,owenId,cash} = req.body;

        const order = new Order({
            optionPayment,
            orders,
            owenId,
            cash
        })
        try {
          const dataOrder = await order.save();
          dataOrder.orders.map(async (item) =>{
            const product = await Product.findOne({_id : item.productId})
            product.quantity = product.quantity - item.number

            await product.save()

          })
          res.json(dataOrder)
        } catch (error) {
          res.json(error)
        }
        // if(dataOrder)
       
        // order.save()
        // .then(data =>{
        //   data.orders.map(item =>{
        //     Product.findByIdAndUpdate(item.productId , {quantity : item.number})
        //     .then(result => res.json(result))
        //     .catch(err2 => res.json(err2))
        //   })
        // })
        // .catch(err => res.json(err))
        
    }
    //delete order
    async deleteOrder (req,res,next){
        const {id} = req.params;
        Order.findByIdAndDelete(id)
        .then((data) => {
          if (data) {
            res.json({ success: true });
          } else {
            res.json({ success: false, message: "ID not found!!!" });
          }
        })
        .catch((err) => res.json({success : false,message:"ID up to 25 numbers"}));
    }
}

export default new historyController();