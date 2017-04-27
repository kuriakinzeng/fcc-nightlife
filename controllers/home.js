const apiController = require('./api');

/**
 * GET /
 * Home page.
 */
exports.index = (req, res) => {
  apiController.getYelp('San Francisco', (err, bars) => {
    if(err) return next(err);
    res.render('home', {
      title: 'Home',
      location: 'San Francisco',
      bars,
      goingCount: 0,
      userId: (req.user && req.user.id) || null,
    })
  })
};

exports.postLocation = (req, res, next) => {
  apiController.getYelp(req.body.location, (err, bars) => {
    if(err) return next(err);
    res.render('home', {
      title: 'Home',
      location: req.body.location,
      bars,
      goingCount: 0,
      userId: (req.user && req.user.id) || null,
    })
  })
};