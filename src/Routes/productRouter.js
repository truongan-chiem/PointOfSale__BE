import express from 'express'

import productController from '../Controllers/productController.js';

const Router = express.Router();




//[GET] - all product or by Name - /product
Router.get('/',productController.getAllorByName)

//[GET] - all product or by Scan- /product
Router.get('/qrscan',productController.getProductByScan)

//[POST] - create product - /product
Router.post('/',productController.createProduct)

//[DEL] - delete product by id - /product
Router.delete('/:id',productController.deleteProduct)

//[PUT] - update product by id - /product
Router.put('/:id',productController.updateProduct)

//[GET] - all product by id - /product:id
Router.get('/:id',productController.getProductById)


export default Router;