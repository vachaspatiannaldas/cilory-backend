const User = require("../Module/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.userSignup = async (req, res) => {
  try {
    const useremail = await User.findOne({ email: req.body.email });
    if (useremail == null && !useremail) {
      const userObj = new User({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        password: req.body.password,
      });
      userObj
        .save()
        .then((response) => {
          res.json({
            user: response,
            status: true,
            messege: "user signup succcessful",
          });
        })
        .catch((response) => {
          res.json({ user: response, messege: " user signup error" });
        });
    } else {
      res.json({ status: false, messege: "user alredy exits" });
    }
  } catch {
    console.log("userSignup error");
  }
};
exports.userLogin = async (req, res) => {
  console.log(req.body);
  const login = await User.findOne({ email: req.body.email });
  if (login === null || 0) {
    res.json({ messege: "user not exits" });
  } else if (login !== null) {
    if (req.body.password) {
      const userdata = await bcrypt.compare(req.body.password, login.password);
      if (userdata) {
        const token = jwt.sign(
          { name: login.name, id: login._id },
          process.env.SECRET_KEY
        );
        res.status(200).json({
          auth: userdata,
          token: token,
          messege: "Login successfully",
        });
      } else if (!userdata || userdata === false) {
        res.json({ auth: false, messege: " invalid detail" });
      }
    } else {
      res.json({ auth: false, messege: "plz provide password" });
    }
  }
};

exports.Getuserinfo = (req, res) => {
  try {
    User.findOne({ _id: req.userid })
      .then((result) => {
        if (result) {
          res.status(200).json({ user: result });
        } else {
          res.status(401).json({ messege: "Unauthorized" });
        }
      })
      .catch((error) => {
        res.status(400).json({ messege: "Bad Request" });
      });
  } catch (error) {
    res.status(500).json({ messege: "Internal server error" });
  }
};

exports.AddAddress = async (req, res) => {
  const { address, state, city, pincode, phone, place, name, _id } = req.body;
  const checkuser = await User.findOne({
    _id: req.userid,
    address: {
      $elemMatch: { _id: _id },
    },
  });

  if (checkuser == null) {
    await User.updateOne(
      { _id: req.userid },
      {
        $push: {
          address: {
            name: name,
            address: address,
            state: state,
            city: city,
            pincode: pincode,
            phone: phone,
            place: place,
          },
        },
      }
    );

    res.json({ user: "" });
  } else {
    const find = {
      _id: req.userid,
      address: {
        $elemMatch: { _id: _id },
      },
    };
    const update = {
      "address.$.address": address,
      "address.$.phone": phone,
      "address.$.state": state,
      "address.$.city": city,
      "address.$.pincode": pincode,
      "address.$.place": place,
      "address.$.name": name,
    };
    await User.updateOne(find, update);

    res.json({ user: "updateed" });
  }
};
exports.DeleteAddress = async (req, res) => {
  const { id } = req.body;
  await User.updateOne(
    { _id: req.userid },
    { $pull: { address: { _id: id } } }
  );
  res.json({ message: "delete successfully" });
};
