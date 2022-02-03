const path = require('path');
const express = require('express');
const multer = require('multer');
const User = require('../models/user');
const auth = require('../middleware/auth');

const router = express.Router();
const upload = multer();

router.post('/users/login', upload.none(), async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.login, req.body.password);
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.post('/users/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();

    res.send({});
  } catch (e) {
    res.status(500).send(e.message);
  }
});

router.post('/users/logoutAll', auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();

    res.send({});
  } catch (e) {
    res.status(500).send(e.message);
  }
});

router.get('/users/me', auth, async (req, res) => {
  res.send(req.user);
});

router.patch('/users/me', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['password'];
  const isValidUpdates = updates.every((update) => allowedUpdates.includes(update));

  try {
    if (!isValidUpdates) {
      throw new Error('Invalid updates.');
    }

    updates.forEach((update) => {
      req.user[update] = req.body[update];
    });

    await req.user.save();
    res.send(req.user);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

module.exports = router;
