const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 8080;
const host = process.env.HOST;
const mongoose = require("mongoose");
const Router = require("./Route");
require("dotenv").config();
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
console.log(process.env.URL);
app.use(cors({ origin: "*" }));
app.use("/", function (req, res, next) {
  req.accepts("application/json");

  next();
});app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});
app.use("/", Router);
if (process.env.NODE_ENV === "production") {
  app.use(express.static("estore/build"));
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "estore", "build", "index.html"));
  });
}
mongoose
  .connect('mongodb+srv://pranav:pranan@cluster0.zl2ix.mongodb.net/project?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
  .then((res) => {
    app.listen(port, host, () => {
      console.log(`server run on ${port}`);
    });
  })
  .catch((res) => {
    console.log(res);
  });
