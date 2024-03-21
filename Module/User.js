const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Shema = mongoose.Schema;
const Usershema = new Shema(
  {
    id: {
      type: mongoose.Types.ObjectId,
    },
    name: {
      type: String,
    },
    phone: {
      type: Number,
    },
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
    },
    address: [
      {
        name: String,
        address: String,
        state: String,
        city: String,
        pincode: Number,
        phone: Number,
        place: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);
Usershema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 10);

  next();
});
module.exports = mongoose.model("user", Usershema);
