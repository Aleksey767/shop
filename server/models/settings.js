const mongoose = require('mongoose');

const settingsSchema = mongoose.Schema({
  currency: {
    type: String,
  },
  exchangeRate: {
    type: Number,
  },
});

settingsSchema.methods.toJSON = function () {
  const settings = this;
  const settingsObject = settings.toObject();
  delete settingsObject._id;
  delete settingsObject.__v;

  return settingsObject;
};

const Settings = mongoose.model('Setting', settingsSchema);

module.exports = Settings;
