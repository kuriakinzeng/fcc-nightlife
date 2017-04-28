const Bar = require('../models/Bar');

exports.updateBar = (req, res, next) =>{
  const id = req.body.id;
  const goingUserId = req.user.id;
  const location = req.body.location;
  console.log('update bar:', id, goingUserId, location);
  Bar.findById(id, (err, barFound) => {
    if(err) return next(err);
    if(barFound){
      const userFound = barFound.goingUserId.indexOf(goingUserId);
      if(userFound === -1) {
        Bar.update({_id:id},{$push:{goingUserId}},(err,updatedBar)=>{
          if(err) return next(err);
          res.status(200).send("1");
        })
      } else {
        Bar.update({_id:id},{$pull:{goingUserId}},(err,updatedBar)=>{
          if(err) return next(err);
          res.status(200).send("-1");
        })
      }
    } else {
      Bar.create({
        _id: id,
        location,
        goingUserId: [goingUserId]
      }, (err, barCreated) => {
        if(err) return next(err);
        res.status(200).send("1");
      });
    }
  });
}