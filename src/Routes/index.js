import ErrorHandler from '../utils/errorHandler.js';
import accRouter from './accRouter.js';
import productRouter from './productRouter.js';
import historyRouter from './historyRouter.js';
import statisticRouter from './statisticRouter.js';
import ipRouter from './ipRouter.js';
const route = (app) =>{
    
    app.use('/acc', accRouter)
    app.use('/product', productRouter)
    app.use('/history', historyRouter)
    app.use('/statistic', statisticRouter)
    app.use('/ip', ipRouter)
    
    app.get('/' , (req,res) => res.send('Point of Sale - API'))

    app.use("*" , (req,res,next) =>{
        return next(new ErrorHandler('The route can not be found!!!',404))
    })
   
}
export default route