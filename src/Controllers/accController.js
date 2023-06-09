import cloundinary from "../utils/cloudinary.js";
import ErrorHandler from "../utils/errorHandler.js";

import {User} from '../Models/User.js'
import { comparePw, hashPw } from "../utils/hashPw.js";

class accController {
  //login account
  async login(req, res, next) {
    if (req.body.account && req.body.password) {
      const { account, password } = req.body;

      const data = await User.findOne({ account });

      if (data) {
        const match = await comparePw(password, data.password);
        if (match) {
          delete data._doc.account;
          delete data._doc.password;

          res.json({ success: true, user: data });
        } else {
          return next(new ErrorHandler("Incorrect password!!!", 404));
        }
      } else {
        return next(new ErrorHandler("Account not exist!!!", 404));
      }
    } else {
      return next(new ErrorHandler("Account or Password is empty!!!", 404));
    }
  }
  //register account
  async register(req, res, next) {
    if (!req.files) {
      return next(new ErrorHandler("Missing field file!!!", 404, "image"));
    } 
    else if (!req.files.image) {
      return next(new ErrorHandler("Missing field image!!!", 404, "image"));
    } 
    else {
      const fileImage = req.files.image;

      const { account, password, role, gender, firstName, lastName } =
        req.body;
      let publicId = Date.now();
      const image = await cloundinary.uploader.upload(fileImage.tempFilePath, {
        public_id: publicId,
        folder: "avatar",
      });

      const user = new User({
        account,
        firstName,
        lastName,
        password: await hashPw(password),
        role,
        image: {
          publicId,
          url :image.secure_url
        },
        gender,
        phoneNumber : '0909090909',
        address : "address living",
        birthday : "0001-00-00",
        location : "Location o quan binh thanh",
        postalCode : 70
      });

      user
      .save()        
        .then((data) => {
          delete data._doc.account
          delete data._doc.password
          res.json(data);
        })
        .catch((err) => {
          
          cloundinary.uploader.destroy(`avatar/${publicId}`)
          if (err.name === "ValidationError") {
            const field = Object.keys(err.errors);
            if (err.errors[field[0]]?.kind === "Number") {
              return next(
                new ErrorHandler(
                  `${field[0]} must be a number!!!`,
                  404,
                  field[0]
                )
              );
            } else {
              return next(
                new ErrorHandler(err.errors[field[0]].message, 404, field[0])
              );
            }
          } else if (err.code === 11000) {
            // res.json(err)
            // console.log(err);
            const keys = Object.keys(err.keyValue);
            return next(
              new ErrorHandler(`${keys[0]} already exist!!!`, 404, keys[0])
            );
          } else {
            res.json(err);
          }
        });
    }
  }
  //find account by id
  async findSomeOne(req, res, next) {
    const { id } = req.params;
    User.findById(id)
      .then((user) => {
        if (user) {
          delete user._doc.account;
          delete user._doc.password;
          res.json(user);
        } else {
          return next(new ErrorHandler("Can not found user!!!", 404));
        }
      })
      .catch((err) => next(new ErrorHandler("Params ID invalid!!!", 404)));
  }
  //find all account
  async findAll (req,res,next){
    User.find({})
    .sort({ _id: -1 })
    .select('-password -account')
    .then(data => res.json(data))
    .catch(err => res.json(err))
  }
  //delete account by id
  async deleteAcc(req, res, next) {
    const { id } = req.params;
    User.findByIdAndDelete(id)
      .then((data) => {
        if (data) {
          res.json({ success: true });
        } else {
          res.json({ success: false, message: "ID not found!!!" });
        }
      })
      .catch((err) => res.json(err));
  }

  //update account by id
  async updateAccById(req,res,next){
    if(!req.params.id){
      return next(new ErrorHandler("Missing ID account!!!", 404, "id"));
    }
    
    else {
      const {id} = req.params;
      
      const fileImage = req.files?.image ? req.files.image : null;
      
      const { account, password, role, gender, firstName, lastName ,phoneNumber,address,birthday,location,postalCode } =
        req.body;
      let newUser = {
        account,
        password: password && await hashPw(password),
        firstName,
        lastName,
        phoneNumber,
        address,
        role,
        birthday,
        location,
        postalCode,
        gender,
      };

      if(fileImage){
      let publicId = Date.now();
      const image = await cloundinary.uploader.upload(fileImage.tempFilePath, {
        public_id: publicId,
        folder: "avatar",
      });
      newUser = {...newUser , image : {
        publicId,
        url : image.secure_url
      }}
    }


      User.findByIdAndUpdate(id, { $set: newUser } ,{new : true})
      .select('-account -password')
      .then((data) => {
        if (data) {
          res.json({ success: true , data });
        } else {
          fileImage && cloundinary.uploader.destroy(`dish/${publicId}`);
          res.json({ success: false, message: "ID not found!!!" });
        }
      })
      .catch((err) => {
        fileImage && cloundinary.uploader.destroy(`dish/${publicId}`);
        if (err.name === "ValidationError") {
          const field = Object.keys(err.errors);
          if (err.errors[field[0]]?.kind === "Number") {
            return next(
              new ErrorHandler(
                `${field[0]} must be a number!!!`,
                404,
                field[0]
              )
            );
          } else {
            return next(
              new ErrorHandler(err.errors[field[0]].message, 404, field[0])
            );
          }
        } else if (err.code === 11000) {
          // res.json(err)
          const keys = Object.keys(err.keyValue);
          return next(
            new ErrorHandler(`${keys[0]} already exist!!!`, 404, keys[0])
          );
        } else {
          res.json(err);
        }
      });
    }
  }

  //change password
  async changePassword(req,res,next){
    const {id} = req.params
    const {currentPassword,newPassword} = req.body

    const data = await User.findById(id).select("password")
    if(data){
      const match = await comparePw(currentPassword , data.password)
      if(match){
        User.findByIdAndUpdate(id,{password : await hashPw(newPassword)})
        .then(dataUpdate => res.json({success : true , message:"Change Password Successfully!!!"}))
        .catch(err => res.json(err))
      }else{
        res.json({message : "Current Password Incorrect !!!"})
      }
    }
    else{
      res.json({message : "Can not found user"})
    }
    
  }
}

export default new accController();
