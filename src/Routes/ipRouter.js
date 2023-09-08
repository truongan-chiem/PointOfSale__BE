import express from 'express'

import ip from 'ip'

const Routes = express.Router();

//[GET] /ip
Routes.get('/', async (req,res)=>{
    res.json({
        ip:ip.address()
    })
})






export default Routes;