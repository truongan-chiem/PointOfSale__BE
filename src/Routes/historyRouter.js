import express from 'express'

import historyController from '../Controllers/historyController.js';

const Router = express.Router();




//[GET] - all order or by Name - /history
Router.get('/',historyController.getOrders)

//[POST] - create order - /history/order
Router.post('/order',historyController.createOrder)

//[DELETE] - delete order - /history/order:id
Router.delete('/order/:id',historyController.deleteOrder)


export default Router;