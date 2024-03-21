const { isAlpha, isStrongPassword, isEmail } = require("validator");
const jwt = require("jsonwebtoken");
exports.secure = (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.SECRET_KEY, function (error, decoded) {
      if (decoded) {
        req.userid = decoded.id;

        next();
      } else if (error) {
        res.status(401).json({ messege: "Unauthorized" });
      }
    });
  } else {
    res.status(401).json({ messege: "Login required" });
  }
};

exports.isvalidate = (req, res, next) => {
  if (req.body.email && !isEmail(req.body.email)) {
    res.json({ messege: " invalid email" });
  } else if (req.body.name && !isAlpha(req.body.name)) {
    res.json({ messege: " invalid name " });
  } else if (req.body.password && !isStrongPassword(req.body.password)) {
    res.json({
      messege:
        "min 1 Uppercase 1 Lowercase 1 Symbol min length 8 charcater password",
    });
  } else {
    next();
  }
};
