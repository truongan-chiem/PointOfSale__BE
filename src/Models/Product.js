import mongoose from "mongoose";

const ProductSchema = mongoose.Schema({
    name : {
        type : String,
        required : [true,'Name Product can not empty!!!']
    },
    desc : {
        type : String,
        required : [true,'Product can not empty!!!']
    },
    type : {
        type : String,
        required : [true,'Type Product can not empty!!!']
    },
    price : {
        type : Number,
        required : [true,'Price Product can not empty!!!']
    },
    image : {
        publicId :{
            type : String
        },
        url:{
            type : String,
            required : [true,'Image can not empty!!!']
        }
    },
    quantity : {
        type : Number,
        required : [true,'Quantity can not empty!!!']
    }
})




export const Product = mongoose.model('Product',ProductSchema)