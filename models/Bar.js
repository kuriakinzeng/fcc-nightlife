const mongoose = require('mongoose');

const barSchema = {
  _id: String,
  location: String,
  goingUserId: [String]
};

const Bar = mongoose.model('Bar', barSchema);

module.exports = Bar;