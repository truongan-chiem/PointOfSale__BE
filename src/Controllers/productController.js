import { Product } from "../Models/Product.js";
import cloundinary from "../utils/cloudinary.js";
import ErrorHandler from "../utils/errorHandler.js";
class productController {
  //get all product or get by name
  async getAllorByName(req, res, next) {
    const { name ,limit, page ,type , sortBy , sortType} = req.query;

    let findValue;
    if(name){
      findValue = {
        name : {$regex: ".*" + name + ".*" ,$options : "i"},
        active : true
      }
    }
    else {
      if(type === 'all'){
        findValue = {
          active : true
        }
      }
      else{
        findValue = {
          active : true,
          type : type
        }
      }
    }
    let sortTemp ={}
    sortTemp[sortBy] = sortType === 'acs' ? 1 : -1;
    Product.find(findValue)
      .sort(sortTemp)
      .limit(!name && limit)
      .skip(!name && ((limit * page) - limit))
      .then((data) => {
      
        Product.find(findValue)
        .then(result => {
          const totalItem = result.length;
          res.json({data:data , pagination : {totalItem:totalItem}})
  
        })
        .catch(err => res.json(err))
      })
      .catch((err) => res.json(err));
  }
  //get all product by qrscan
  async getProductByScan(req, res, next) {
    const { qrScan } = req.query;

    Product.find({active : true , qrScan : qrScan})
      .sort({ _id: -1 })
      .then((data) => res.json(data))
      .catch((err) => res.json(err));
  }
  //create new Product
  async createProduct(req, res, next) {
    if (!req.files) {
      return next(new ErrorHandler("Missing field file!!!", 404, "image"));
    } else if (!req.files.image) {
      return next(new ErrorHandler("Missing field image!!!", 404, "image"));
    } else {
      const { name, type, price, desc, quantity, originalPrice, qrScan  } = req.body;
   

      let publicId = Date.now();
      const fileImage = req.files.image;
      const image = await cloundinary.uploader.upload(fileImage.tempFilePath, {
        public_id: publicId,
        folder: "product",
      });

      const product = new Product({
        name,
        type,
        price,
        desc,
        quantity,
        image: {
          publicId: publicId,
          url: image.secure_url,
        },
        originalPrice, 
        qrScan
      });

      product
        .save()
        .then((data) => {
          res.json(data);
        })
        .catch((err) => {
          cloundinary.uploader.destroy(`product/${publicId}`);
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
          }
          else if (err.code === 11000) {
            const keys = Object.keys(err.keyValue);
            return next(
              new ErrorHandler(`${keys[0] === "qrScan" ? "Bar Code" : keys[0]} already exist!!!`, 404, keys[0])
            )
          }
          else {
            res.json(err);
          }
        });
    }
  }
  //delete product
  async deleteProduct(req, res, next) {
    const { id } = req.params;
    Product.findByIdAndUpdate(id , {active : false})
      .then((data) => {
        if (data) {
          res.json({ success: true });
        } else {
          res.json({ success: false, message: "ID not found!!!" });
        }
      })
      .catch((err) => res.json(err));
  }
  //update product
  async updateProduct(req, res, next) {
    if (!req.params.id) {
      return next(new ErrorHandler("Can not find ID to Update!!!", 404, "id"));
    } else if (!req.files) {
      return next(new ErrorHandler("Missing field file!!!", 404, "image"));
    } else if (!req.files.image) {
      return next(new ErrorHandler("Missing field image!!!", 404, "image"));
    } else {
      const { id } = req.params;
      const { name, type, price, desc ,quantity , originalPrice, qrScan } = req.body;
     
      let publicId = Date.now();
      const fileImage = req.files.image;
      const image = await cloundinary.uploader.upload(fileImage.tempFilePath, {
        public_id: publicId,
        folder: "product",
      });

      const newProduct = {
        name,
        type,
        price,
        desc,
        quantity,
        image: {
          publicId,
          url: image.secure_url,
        },
        originalPrice, 
        qrScan
      };
      Product.findByIdAndUpdate(id, { $set: newProduct } ,{new : true})
        .then((data) => {
          if (data) {
            res.json({ success: true , data });
          } else {
            cloundinary.uploader.destroy(`product/${publicId}`);
            res.json({ success: false, message: "ID not found!!!" });
          }
        })
        .catch((err) => {
          cloundinary.uploader.destroy(`product/${publicId}`);

          if(err.name === 'CastError' && err.path === 'price'){
            return next(new ErrorHandler(`Price must be a number!!!`,404,'price'))
          }
          else if(err.name === 'CastError' && err.path === 'quantity'){
            
            return next(new ErrorHandler(`Quantity must be a number!!!`,404,'quantity'))
          }
          else{
           res.json(err)
          }
        });
    }
  }

  //get product by id
  async getProductById (req,res,next){
    const id = req.params.id

    Product.findById(id)
    .then(data => res.json(data))
    .catch(error => res.json(error))
  }
}
export default new productController();
