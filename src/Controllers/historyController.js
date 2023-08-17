import { Order } from "../Models/Order.js";
import { Product } from "../Models/Product.js";

class historyController {
  //get orders
  async getOrders(req, res, next) {
    const { start, end, limit, page , sortBy, sortType} = req.query;

    let lastTimeOfDayEnd = new Date(end);
    lastTimeOfDayEnd.setHours(23, 59, 59, 999);
    let sortTemp ={}
    sortTemp[sortBy] = sortType === 'acs' ? 1 : -1;
    Order.find(
      start && end
        ? {
            created_at: {
              $gte: new Date(start),
              $lt: lastTimeOfDayEnd,
            },
          }
        : {}
    )
      .sort(sortTemp)
      .populate({
        path: "owenId",
        select: "_id firstName lastName image role gender",
      })
      .populate({ path: "orders.productId", select: "-listOptions" })
      .limit(limit)
      .skip(limit * page - limit)
      .then((data) => {
        Order.find(
          start && end
            ? {
                created_at: {
                  $gte: new Date(start),
                  $lt: lastTimeOfDayEnd,
                },
              }
            : {}
        )
          .sort({ _id: -1 })
          .populate({
            path: "owenId",
            select: "_id firstName lastName image role gender",
          })
          .populate({ path: "orders.productId", select: "-listOptions" })
          .then((totalData) => {
            let totalItem = totalData.length;
            let profit = 0;
            let countProductSold = 0
            totalData.forEach(bill =>{
              let temp = 0;
              let tempCount = 0;
              bill.orders.forEach(itemOrder =>{
                temp += (itemOrder.productId.price - itemOrder.productId.originalPrice) * itemOrder.number
                tempCount+=itemOrder.number
              })
              profit+=temp;
              countProductSold+=tempCount;
            })


            res.json({
              data: data,
              pagination: {
                totalItem,
                profit,
                countProductSold
              },
            });
            
          });
      })
      .catch((err) => res.json(err));
  }

  //create order
  async createOrder(req, res, next) {
    const { optionPayment, orders, owenId, cash , totalPrice } = req.body;
    const count = orders.reduce(
      (total,item) =>  total + item.number,
      0
    )
    const order = new Order({
      optionPayment,
      orders,
      owenId,
      cash,
      totalPrice,
      count
    });
    try {
      const dataOrder = await order.save();
      dataOrder.orders.map(async (item) => {
        const product = await Product.findOne({ _id: item.productId });
        product.quantity = product.quantity - item.number;

        await product.save();
      });
      res.json(dataOrder);
    } catch (error) {
      res.json(error);
    }
  }
  //delete order
  async deleteOrder(req, res, next) {
    const { id } = req.params;
    Order.findByIdAndDelete(id)
      .then((data) => {
        if (data) {
          res.json({ success: true });
        } else {
          res.json({ success: false, message: "ID not found!!!" });
        }
      })
      .catch((err) =>
        res.json({ success: false, message: "ID up to 25 numbers" })
      );
  }
}

export default new historyController();
