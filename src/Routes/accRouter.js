import express from 'express'

import accController from '../Controllers/accController.js';
import { User } from '../Models/User.js';

const Routes = express.Router();

//[GET] /acc/
Routes.get('/', accController.findAll)

//[GET] - get order by full name : /acc/order/:id
Routes.get('/order',accController.getOrderByNameAcc)

//
// Routes.get('/updateAllAcc' ,async (req,res) =>{
//     User.updateMany({}, { $set: { address: 'Default Address' } })
//     .then(data => {res.json(data)})
//     .catch(err => res.json(err))
// })

//[GET] /acc/:id
Routes.get('/:id', accController.findSomeOne)

//[DEL] - delete acc : /acc/:id
Routes.delete('/:id' ,accController.deleteAcc)

//[POST] - login : /acc/login
Routes.post('/login' , accController.login)

//[POST] - register : /acc/register
Routes.post('/register' ,accController.register)

//[PUT] - update : /acc/update/:id
Routes.put('/update/:id' ,accController.updateAccById)

//[PUT] - change pw : /acc/changepw/:id
Routes.put('/changepw/:id' ,accController.changePassword)





export default Routes;