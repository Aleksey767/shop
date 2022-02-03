const express = require('express');
const Products = require('../models/product');
const Settings = require('../models/settings');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/settings', async (req, res) => {
  try {
    const settings = await Settings.find({});
    const productsCount = await Products.estimatedDocumentCount();

    res.send({ settings, productsCount });
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.patch('/settings', auth, async (req, res) => {
  try {
    const settings = await Settings.findOneAndUpdate({}, req.body, { new: true });

    if (!settings) {
      return res.status(404).send();
    }

    res.send(settings);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

module.exports = router;
