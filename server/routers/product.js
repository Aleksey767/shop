const express = require('express');
const Product = require('../models/product');
const auth = require('../middleware/auth');
const multer = require('multer');

const router = express.Router();

const upload = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, callback) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return callback(new Error('Please upload in jpg or jpeg or png format.'));
    }
    callback(null, true);
  },
});

function parseReqBody(req) {
  return {
    name: req.body.name,
    types: req.body.types,
    vehicle: {
      type: req.body['vehicle.type'] ? req.body['vehicle.type'] : null,
      nation: req.body['vehicle.nation'] ? req.body['vehicle.nation'] : null,
      level: req.body['vehicle.level'] ? parseFloat(req.body['vehicle.level']) : null,
    },
    price: parseFloat(req.body.price),
    salePrice: req.body.salePrice ? parseFloat(req.body.salePrice) : null,
    showDiscountAs: req.body.showDiscountAs,
    details: req.body.details,
    image: req.file?.buffer,
    isCountable: req.body.isCountable ? true : false,
    priority: req.body.priority ? parseFloat(req.body.priority) : 31,
  };
}

router.post(
  '/products',
  auth,
  upload.single('image'),
  async (req, res) => {
    let productObj = parseReqBody(req);

    const product = new Product(productObj);

    try {
      await product.save();
      res.status(201).send(product);
    } catch (e) {
      res.status(400).send(e.message);
    }
  },
  (error, req, res, next) => {
    res.status(400).send(error.message);
  }
);

router.get('/products', async (req, res) => {
  try {
    const products = await Product.find({}, null, {
      limit: parseInt(req.query.limit),
      skip: parseInt(req.query.skip),
      sort: {
        priority: 1,
      },
    });
    res.send(products);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).send();
    }

    res.send({ product, details: product.details });
  } catch (e) {
    res.status(500).send(e.message);
  }
});

router.get('/products/:id/image', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product || !product.image) {
      throw new Error();
    }

    res.set('Content-Type', 'image/png');
    res.send(product.image);
  } catch (e) {
    res.status(404).send();
  }
});

router.patch(
  '/products/:id',
  auth,
  upload.single('image'),
  async (req, res) => {
    const allowedUpdates = [
      'name',
      'types',
      'vehicle.type',
      'vehicle.nation',
      'vehicle.level',
      'price',
      'salePrice',
      'showDiscountAs',
      'isCountable',
      'priority',
      'details',
      'image',
    ];

    if (
      req.body.types.includes('vehicle') &&
      (!req.body['vehicle.type'] || !req.body['vehicle.nation'] || !req.body['vehicle.level'])
    ) {
      res.status(400).send('Vehicle should include all vehicle characteristics.');
      return;
    }

    const updates = Object.keys(req.body);

    const isValidUpdates = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidUpdates) {
      return res.status(400).send('Invalid updates.');
    }

    let updateObject = parseReqBody(req);

    try {
      const product = await Product.findByIdAndUpdate(req.params.id, updateObject, {
        new: true,
      });

      if (!product) {
        return res.status(404).send();
      }

      res.send(product);
    } catch (e) {
      res.status(500).send(e.message);
    }
  },
  (error, req, res, next) => {
    res.status(400).send(error.message);
  }
);

router.delete('/products/:id', auth, async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ _id: req.params.id });

    if (!product) {
      res.status(404).send({});
    }

    res.send(product);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

module.exports = router;
