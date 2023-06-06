const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  productId: { type: String },
  productName: { type: String },
  productDescription:{type:String},
  productPrice: { type: Number },
  productSalePrice: { type: Number },
  productDiscountPrice:{type:Number },
  productImages: { type: Array },
  category: {type: String},
  brands: {type: String},
  // subCategory: { type: String, required: true },
  Stock: [{Size: { type: String, }, 
    Quantity: { type: Number, },
    },
  ],
}, {timestamps: true});

const product = mongoose.model('product', productSchema);

module.exports = product;
