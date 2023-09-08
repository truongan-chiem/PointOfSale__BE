import mongoose from "mongoose";


const UserSchema = mongoose.Schema({
    account : {
        type : String,
        required :[true,'Account can not empty!!!'],
        index: { unique: true } 
    },
    password : {
        type : String,
        required :[true,'Password can not empty!!!'],
    },
    firstName : {
        type : String,
        required :[true,'First Name can not empty!!!'],
    },
    lastName : {
        type : String,
        required :[true,'Last Name can not empty!!!'],
    },
    role : {
        type : Number,
        required :[true,'Role can not empty!!!'],
    },
    image : {
        publicId : {
            type : String
        },
        url :{
            type : String,
            required :[true,'Image can not empty!!!'],
        }
    },
    gender : {
        type : String,
        enum :{
            values : ['male','female'],
            message : 'Gender must be a male or female!!!'
        },
        required :[true,'Gender can not empty!!!'],
    },
    phoneNumber :{
        type : String,
        required : [true,"Phone number can not empty!!!"],
        minLength : 10,
        maxLength : 10
    },
    address :{
        type : String,
        required : [true,"Address can not empty!!!"]
    },
    birthday :{
        type : String,
        required : [true,"Birth day can not empty!!!"]
    },
    location :{
        type : String,
        required : [true,"Location can not empty!!!"]
    },
    postalCode :{
        type : Number,
        required : [true,"Postal Code can not empty!!!"]
    },
    active: {
        type: Boolean,
        default : true
    }
})

export const User = mongoose.model("User",UserSchema)