const express = require('express');
require('./db/mongoose');
const path = require('path');
const usersRouter = require('./routers/user');
const productsRouter = require('./routers/product');
const settingsRouter = require('./routers/settings');

const app = express();

app.use(express.static(path.resolve(__dirname, 'static')));

app.get('/admin', (req, res) => {
  res.sendFile(__dirname + '/static/admin.html');
});

app.get('/admin_entry', (req, res) => {
  res.sendFile(__dirname + '/static/admin_entry.html');
});

app.use(express.json());
app.use(settingsRouter);
app.use(usersRouter);
app.use(productsRouter);

module.exports = app;
