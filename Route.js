const express = require("express");
const route = express.Router();
const productCtroller = require("./Controller/Category");
const userController = require("./Controller/User");
const { deletecartproduct } = require("./Controller/AddtoCart");
const cartController = require("./Controller/AddtoCart");
const { userSignup, Getuserinfo } = require("./Controller/User");
const Productcontroller = require("./Controller/Product");
const { isvalidate, secure } = require("./Controller/Middleware");
const {
  OrderProducts,
  getorderproducts,
  NewOrderProducts,
  GetOrderDetailByID,
} = require("./Controller/Orders");
const { getproducts } = require("./Controller/newFilter");
const { orderverify, order } = require("./Controller/getway");
route.post("/usersignup", isvalidate, userSignup);
route.post("/userlogin", userController.userLogin);
route.post("/neworderproduct", secure, NewOrderProducts);
route.get("/getuserinfo", secure, Getuserinfo);
route.get("/getorderdetail/:id", secure, GetOrderDetailByID);
route.post("/addproduct", productCtroller.createcategary);
route.get("/getcategory", productCtroller.getcategory);
route.post("/addtocart", secure, cartController.addtocart);
route.post("/getcart", secure, cartController.getcart);
route.post("/deletecartproduct", secure, deletecartproduct);
//route.post("/getfilter/:slug", FilterCtroller.getfilter);
route.get("/getproduct/:slug", getproducts);
route.post("/product/:id", Productcontroller.getProductById);
route.post("/productorder", secure, OrderProducts);
route.post("/orders", order);

route.put("/updateaddress", secure, userController.AddAddress);
route.put("/deleteaddress", secure, userController.DeleteAddress);
route.get("/getorderproduct", secure, getorderproducts);
route.post("/verify", orderverify);
module.exports = route;
