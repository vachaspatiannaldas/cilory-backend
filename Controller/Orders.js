const Order = require("../Module/Order");
const Cart = require("../Module/AddtoCart");
const mongoose = require("mongoose");
exports.OrderProducts = async (req, res) => {
  const userid = await Order.findOne({ userid: req.userid });

  if (userid !== null) {
    console.log("old user");
    Order.updateOne(
      {
        userid: req.userid,
      },
      {
        $push: {
          orders: req.body.product,
        },
      }
    )
      .then((result) => {
        console.log(result);
        Cart.deleteOne({ userid: req.userid }).then((res) => {
          console.log(res);
        });
        res.json({ orderresponse: req.userid });
      })
      .catch((error) => {
        console.log(error);
      });
  } else {
    console.log("new");
    const odersproduct = new Order({
      userid: req.userid,
      orders: req.body.product,
    });
    odersproduct.save().then((response) => {
      Cart.deleteOne({ userid: req.userid }).then((res) => {
        console.log(res);
      });
      res.json({ orderresponse: response._id });
    });
  }
};

exports.getorderproducts = (req, res) => {
  Order.find({ userid: req.userid })
    .populate({
      path: "orders",
      populate: {
        path: "product",
      },
    })
    .select(["_id,orders,createdAt"])
    .then((response) => {
      res.json({ products: response });
    });
};
exports.GetOrderDetailByID = async (req, res) => {
  try {
    const OrderData = await Order.findOne({
      _id: req.params.id,
      userid: req.userid,
    }).populate({
      path: "orders",
      populate: {
        path: "product",
      },
    });
    if (OrderData) {
      res.json({
        orders: OrderData.orders || [],
        OrderId: OrderData._id,
        date: OrderData.createdAt,
        found: true,
      });
    } else {
      res.json({ found: false });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};
exports.NewOrderProducts = async (req, res) => {
  const CartItems = await Cart.findOne({ userid: req.userid });
  const newcart = CartItems.cartitem.map(({ product, quantity, size }) => {
    return { product, quantity, size };
  });

  const newOrder = new Order({
    userid: req.userid,
    orders: newcart,
    quantity: newcart.quantity,
  });
  newOrder
    .save()
    .then(async (response) => {
      await Cart.deleteOne({ userid: req.userid });
      res.json({
        Orders: response.orders,
        OrderId: response._id,
        date: response.createdAt,
      });
    })
    .catch((error) => {
      console.log(error);
    });
};
