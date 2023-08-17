import mongoose, { Schema } from "mongoose";

const itemOrder = mongoose.Schema({
    productId : {
        type : mongoose.Types.ObjectId,
        ref : 'Product'
    },
    number : {
        type : Number,
        required : [true,'Number in ItemOrder must be required!!!']
    }
} ,{_id : false})

const OrderSchema = mongoose.Schema({
    optionPayment : {
        type  : Number,
        required : [true,'Can not empty Option Payment!!!']
    },
    orders : [itemOrder],
    owenId :{
        type : mongoose.Types.ObjectId,
        ref : 'User'
    },
    cash:{
        type  : Number,
        required : [true,'Can not empty Cash!!!']
    },
    count:{
        type  : Number,
        required : [true,'Can not empty count!!!']
    },
    totalPrice:{
        type  : Number,
        required : [true,'Can not empty TotalPrice!!!']
    }
}, { timestamps: { createdAt: 'created_at' } })

export const Order = mongoose.model("Order",OrderSchema)