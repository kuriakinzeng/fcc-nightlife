const apiController = require('./api');
const Bar = require('../models/Bar');

/**
 * GET /
 * Home page.
 */
exports.index = (req, res) => {
  res.render('home', {
    title: 'Home',
    location: 'San Francisco'
  })
};

exports.postLocation = (req, res, next) => {
  const location = req.body.location;
  apiController.getYelp(location, (err, bars) => {
    if (err) return next(err);
    Bar.find({ location }, function (err, barsFound) {
      if (err) return next(err);
      bars.map((bar) => {
        const sameBar = barsFound.find(barFound => (barFound._id == bar.id));
        bar["goingUserId"] = (sameBar) ? sameBar.goingUserId : [];
      });
      res.json({
        location,
        bars,
        userId: (req.user && req.user.id) || null,
      })
    });
  })
};