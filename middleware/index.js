// all the middleware goes here
var camp = require("../models/campground");
var Comment = require("../models/comment");
var middlewareObj = {};

middlewareObj.checkCampOwnership = function (req, res, next) {
  if (req.isAuthenticated()) {
    camp.findById(req.params.id, function (err, foundCamp) {
      if (err) {
        req.flash("error", "Campground not found!!");
        res.redirect("back")
      }
      else {
        //does user own the campground? if not redirect to camp page
        //using built-in equals() method that comes with mongoose because under the screen both author.id and user.id not equal;
        if (foundCamp.author.id.equals(req.user._id)) {
          next();
        }
        else {
          req.flash("error", "You dont have the permission!!");
          res.redirect("back")
        }
      }
    });
  }
  else {
    //to send the user back where is coming from
    req.flash("error", "Please login to do that!");
    res.redirect("back")
  }

}

middlewareObj.checkCommentOwnership = function (req, res, next) {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comments_id, function (err, foundComment) {
      if (err) {
        res.redirect("back")
      }
      else {
        //if does user own the comment?
        if (foundComment.author.id.equals(req.user._id)) {
          next();
        }
        else {
          req.flash("error", "You dont have the permission!");
          res.redirect("back")
        }
      }
    });
  }
  else {
    //to send the user back where is coming from
    req.flash("error", "You need to lo gin!");
    res.redirect("back")
  }

}

middlewareObj.isLoggedIn = function (req, res, next) {
  if (req.isAuthenticated()) {
    //when user is checked function call next()
    return next();
  }
  req.flash("error", "Please login first !"); // flash message will pop-up on the next page, next page will be /login
  res.redirect("/login");
}


module.exports = middlewareObj;
