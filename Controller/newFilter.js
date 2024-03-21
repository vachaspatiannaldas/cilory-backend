const products = require("../Module/test");

exports.getproducts = async (req, res) => {
  let gender = undefined;
  let category = undefined;
  let convertreg = function (category) {
    for (let i = 0; i < category.length; i++) {
      category[i] = new RegExp(
        category[i].charAt(0).toUpperCase() + category[i].substring(1)
      );
    }
    return category;
  };
  const reqcategory = req.params.slug.split("-");
  reqcategory.shift();
  category = convertreg(reqcategory);

  if (
    req.params.slug.startsWith("w") ||
    (req.params.slug.startsWith("W") && req.params.slug.includes("women"))
  ) {
    gender = "Women";
  } else if (req.params.slug.includes("men")) {
    gender = "Men";
  }
  const filterquery = {};
  if (gender) {
    Object.assign(filterquery, { gender: gender });
  }
  if (category.length >= 1) {
    Object.assign(filterquery, { category: { $in: category } });
  }
  const datas = await products.aggregate([
    {
      $match: filterquery,
    },

    {
      $facet: {
        brand: [
          { $group: { _id: "$brand", count: { $count: {} } } },
          { $sort: { _id: 1 } },
        ],
        gender: [
          { $group: { _id: "$gender", count: { $count: {} } } },
          { $sort: { _id: 1 } },
        ],
        season: [
          { $group: { _id: "$season", count: { $count: {} } } },
          { $sort: { _id: 1 } },
        ],
        category: [
          { $group: { _id: "$category", count: { $count: {} } } },
          { $sort: { _id: 1 } },
        ],
        primaryColour: [
          { $group: { _id: "$primaryColour", count: { $count: {} } } },
          { $sort: { _id: 1 } },
        ],
      },
    },
  ]);

  const query = {};
  if (gender) {
    Object.assign(query, { gender: gender });
  }
  if (req.query.brand) {
    Object.assign(query, { brand: { $in: req.query.brand.split(",") } });
  }
  if (req.query.primaryColour) {
    Object.assign(query, {
      primaryColour: { $in: req.query.primaryColour.split(",") },
    });
  }
  if (req.query.season) {
    Object.assign(query, {
      season: { $in: req.query.season.split(",") },
    });
  }
  if (category.length >= 1) {
    Object.assign(query, { category: category });
  }

  const getproducts = await products.find(query).sort({ brand: 1 }).limit(40);
  const obj = { filterdata: datas, products: getproducts };

  res.json(obj);
};
