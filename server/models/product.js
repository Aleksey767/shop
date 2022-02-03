const mongoose = require('mongoose');

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    types: [
      {
        type: String,
        required: true,
        trim: true,
        validate(value) {
          if (!['vehicle', 'gold', 'premium_account', 'stuff'].includes(value)) {
            throw new Error('Type is invalid!');
          }
        },
      },
    ],
    vehicle: {
      type: {
        type: String,
        validate(value) {
          if (this.types.includes('vehicle') && !value) {
            throw new Error('You should provide a type of vehicle.');
          }
        },
      },
      nation: {
        type: String,
        validate(value) {
          if (this.types.includes('vehicle') && !value) {
            throw new Error('You should provide a nation of vehicle.');
          }
        },
      },
      level: {
        type: Number,
        validate(value) {
          if (this.types.includes('vehicle') && !value) {
            throw new Error('You should provide a level of vehicle.');
          }
        },
      },
    },
    price: {
      type: Number,
      required: true,
      trim: true,
      validate(value) {
        if (value < 0) {
          throw new Error('Price should be positive.');
        }
      },
    },
    salePrice: {
      type: Number,
      validate(value) {
        if (value < 0) {
          throw new Error('Sale price should be positive.');
        }
      },
    },
    showDiscountAs: {
      type: String,
      validate(value) {
        if (!['%', 'money'].includes(value)) {
          throw new Error('showDiscountAs is invalid!');
        }
      },
    },
    details: {
      type: String,
    },
    image: {
      type: Buffer,
      required: true,
    },
    isCountable: {
      type: Boolean,
    },
    priority: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

productSchema.methods.toJSON = function () {
  const product = this;
  const productObject = product.toObject();
  delete productObject.image;
  delete productObject.details;
  delete productObject.createdAt;
  delete productObject.updatedAt;
  delete productObject.__v;
  productObject.id = productObject._id;
  delete productObject._id;

  return productObject;
};

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
