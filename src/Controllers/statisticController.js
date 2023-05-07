import { Order } from "../Models/Order.js";
import {Product} from "../Models/Product.js"
import {subDays,formatDistanceStrict} from 'date-fns'
import { getDatesInRange } from "../utils/getDatesInRannge.js";

class statisticController {
  //get statictis
  async getStatistic(req, res, next) {
    const { start, end } = req.query;

    let firstTimeOfDay = new Date(start)
    firstTimeOfDay.setHours(0, 0, 0, 0);

    let lastTimeOfDay = new Date(end);
    lastTimeOfDay.setHours(23, 59, 59, 999);

    // GET DATE IN RANGE START AND END DATE
    const datesInRange = getDatesInRange(firstTimeOfDay,lastTimeOfDay)

    let dataCurrentOrder ;
    let dataPreviousOrder;

    // Số ngày trong khoảng thời gian được chọn
    const distance = Number(formatDistanceStrict(new Date(firstTimeOfDay), new Date(lastTimeOfDay), {
      unit: 'day'
    }).split(" ")[0])
    
    // Khoảng thời gian start - end theo khoảng thời gian được người dùng chọn
    const lastPreviousOrder = subDays(new Date(start),1)
    lastPreviousOrder.setHours(23, 59, 59, 999);
    const startPreviousOrder = subDays(new Date(lastPreviousOrder) , distance);

    const dataChart = [];
    datesInRange.forEach(e => {
      dataChart.push({
        day : e,
        sales : 0
      })
    })
    // START get currentOrder from start - end day by user choose
    try {
      const currentOrder =  await Order.find(
        start && end
          ? {
              created_at: {
                $gte: firstTimeOfDay,
                $lt: lastTimeOfDay,
              },
            }
          : {}
      ).sort({ _id: -1 }).populate({ path: "orders.productId", select: "-quantity -image" })

        
        const totalBills = currentOrder.length;
        let revenue = 0;
        let productSold = 0;
        let cash = 0;
        let banking = 0;
        currentOrder.forEach((item) => {
          // tính tổng doanh thu
          const totalAmount = item.orders.reduce(
            (total, order) => total + order.productId.price * order.number,
            0
          );
          // end
          revenue += totalAmount;
          // tính tổng số lượng sản phẩm bán đc
          const totalProduct = item.orders.reduce((total,order) => total + order.number,0)
          productSold += totalProduct
          // end


          // tính tổng tiền măt và banking
            if(item.optionPayment === 0){
                const totalCash = item.orders.reduce(
                    (total, order) => total + order.productId.price * order.number,
                    0
                  );
                  cash += totalCash
            }
            else{
                const totalBanking = item.orders.reduce(
                    (total, order) => total + order.productId.price * order.number,
                    0
                  );
                  banking += totalBanking
            }
            // end

            // START SALES BY DAY
            const day = `${item.created_at.getDate()}-${item.created_at.getMonth()+1}-${item.created_at.getFullYear()}`
            const indexDataChart = dataChart.findIndex(i => i.day === day)
            if(indexDataChart === -1){
              dataChart.push({day , sales : totalAmount})
            }
            else{
              dataChart.splice(indexDataChart,1,{day,sales : dataChart[indexDataChart].sales + totalAmount})
            }
           
          });
          dataCurrentOrder = {
                revenue,
                productSold,
                totalBills,
                amount :{
                  cash,
                  banking
                }
            }

    } catch (error) {
      res.json(error)
    }
    // END get currentOrder from start - end day by user choose


    // START get previousOrder from start - end day by user choose
    try {
      const previousOrder =  await Order.find(
          {
              created_at: {
                $gte: startPreviousOrder,
                $lt: lastPreviousOrder,
              },
            }
          
      ).sort({ _id: -1 }).populate({ path: "orders.productId", select: "-quantity" })


        const totalBills = previousOrder.length;
        let revenue = 0;
        let productSold = 0;
        let cash = 0;
        let banking = 0;
        previousOrder.forEach((item) => {
          // tính tổng doanh thu
          const totalAmount = item.orders.reduce(
            (total, order) => total + order.productId.price * order.number,
            0
          );
          // end
          revenue += totalAmount;
          // tính tổng số lượng sản phẩm bán đc
          const totalProduct = item.orders.reduce((total,order) => total + order.number,0)
          productSold += totalProduct
          // end


          // tính tổng tiền măt và banking
            if(item.optionPayment === 0){
                const totalCash = item.orders.reduce(
                    (total, order) => total + order.productId.price * order.number,
                    0
                  );
                  cash += totalCash
            }
            else{
                const totalBanking = item.orders.reduce(
                    (total, order) => total + order.productId.price * order.number,
                    0
                  );
                  banking += totalBanking
            }
            // end

           
          });
          dataPreviousOrder = {
                revenue,
                productSold,
                totalBills,
                amount :{
                  cash,
                  banking
                }
            }
    } catch (error) {
      res.json(error)
    }
    let percentRevenue = dataPreviousOrder.revenue !== 0 ? ((dataCurrentOrder.revenue - dataPreviousOrder.revenue) / dataPreviousOrder.revenue) * 100 : 0
    let percentProductSold = dataPreviousOrder.productSold !== 0 ? ((dataCurrentOrder.productSold - dataPreviousOrder.productSold) / dataPreviousOrder.productSold) * 100 : 0
    let percentTotalBills = dataPreviousOrder.totalBills !== 0 ? ((dataCurrentOrder.totalBills - dataPreviousOrder.totalBills) / dataPreviousOrder.totalBills) * 100 : 0
    let percentCash= dataPreviousOrder.amount.cash !== 0 ? ((dataCurrentOrder.amount.cash - dataPreviousOrder.amount.cash) / dataPreviousOrder.amount.cash) * 100 : 0
    let percentBanking = dataPreviousOrder.amount.banking !== 0 ? ((dataCurrentOrder.amount.banking - dataPreviousOrder.amount.banking) / dataPreviousOrder.amount.banking) * 100 : 0

    let result = {
      revenue : {
        value : dataCurrentOrder.revenue,
        percent : percentRevenue
      },
      productSold :{
        value : dataCurrentOrder.productSold,
        percent : percentProductSold
      },
      totalBills :{
        value : dataCurrentOrder.totalBills,
        percent : percentTotalBills
      },
      cash :{
        value : dataCurrentOrder.amount.cash,
        percent : percentCash
      },
      banking :{
        value : dataCurrentOrder.amount.banking,
        percent : percentBanking
      },
      dataChart
    }
    res.json(result)
  }

  // get trending product /month
  async getTrendingProduct(req,res,next){

    const date = new Date();

    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    
    let start = `${year}-${month}-01`
    date.setUTCHours(23,59,59,999);


    Order.find({
      created_at: {
        $gte: new Date(start),
        $lt: date,
      }
    })
      .sort({ _id: -1 })
      .populate({ path: "orders.productId", select: "-quantity" })
      .then((data) => {
        let arrTemp = []
        data.forEach((item) => {
            item.orders.forEach((order) =>{
                const index = arrTemp.findIndex(i => i.productId._id === order.productId._id)
                if(index === -1){
                    arrTemp.push(order)
                }
                else{
                    const newNumber = order.number + arrTemp[index].number;
                    arrTemp.splice(index,1,{...order._doc , number : newNumber}) 
                }
            })

        });
        arrTemp = arrTemp.sort((a,b) => b.number - a.number);
        res.json(arrTemp);
      })
      .catch((err) => res.json(err));
  }

  // get out of stock product

  async getOutOfStock(req,res,next){
    Product.find({quantity : {
      $lt: 10
    }})
    .sort({quantity:1})
    .then(data => res.json(data))
    .catch(err => res.json(err))
  }
}

export default new statisticController();
