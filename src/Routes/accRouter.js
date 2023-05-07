import express from 'express'

import accController from '../Controllers/accController.js';


const Routes = express.Router();

//[GET] /acc/
Routes.get('/', accController.findAll)

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