import express from 'express'

import statisticController from '../Controllers/statisticController.js';

const Router = express.Router();


//[GET] - all statistic or by Name - /statistic
Router.get('/',statisticController.getStatistic)

// [GET] - get trending product by month - /statistic/trending
Router.get('/trending',statisticController.getTrendingProduct)


// [GET] - get trending product by month - /statistic/trending
Router.get('/outofstock',statisticController.getOutOfStock)

export default Router;