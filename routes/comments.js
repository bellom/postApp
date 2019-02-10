//***************************
// COMMENTS ROUTE
//***************************
var express = require("express");
var router = express.Router();
var camp = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");



//comment new
//To check for loggedin user, we add isLoggedIn function, once user is checked func calls next() func inside the route
router.get("/main/:id/comments/new", middleware.isLoggedIn, function (req, res) {
  //find camp by id
  camp.findById(req.params.id, function (err, camp) {
    if (err) {
      console.log(err);
    }
    else {
      res.render("comments/new", { camp: camp });
    }
  })

});

//comment create
//To prevent user using postman to fire a post request, we add the func isLoggedIn
router.post("/main/main/:id/comments", middleware.isLoggedIn, function (req, res) {
  //lookup camp using ID
  camp.findById(req.params.id, function (err, camp) {
    if (err) {
      console.log(err);
      res.redirect("/main");
    }
    else {
      //create new comment
      Comment.create(req.body.comment, function (err, comment) {
        if (err) {
          req.flash("error", "Something went wrong!!");
          console.log(err);
        }
        else {
          //add username and id to comment and save
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.save();
          //connet new comment to camp
          camp.comments.push(comment);
          camp.save();
          //re-direct to camp show page
          req.flash("success", "successfully added a comment!!");
          res.redirect("/main/" + camp._id);
        }
      })
    }
  });
});

//COMMENT EDIT ROUTE
router.get("/main/:id/comments/:comments_id/edit", middleware.checkCommentOwnership, function (req, res) {
  Comment.findById(req.params.comments_id, function (err, foundComment) {
    if (err) {
      res.redirect("back");
    }
    else {
      res.render("comments/edit", { camp_id: req.params.id, comment: foundComment });
    }
  })
});

//COMMENT UPDATE ROUTE
router.put("/main/main/:id/comments/:comments_id", middleware.checkCommentOwnership, function (req, res) {
  Comment.findByIdAndUpdate(req.params.comments_id, req.body.comment, function (err, updateComment) {
    if (err) {
      console.log(err);
      res.redirect("back");

    }
    else {
      res.redirect("/main/" + req.params.id);
    }
  });
});


//COMMENT DESTROY ROUTE
router.delete("/main/:id/comments/:comments_id", middleware.checkCommentOwnership, function (req, res) {
  Comment.findByIdAndRemove(req.params.comments_id, function (err) {
    if (err) {
      console.log(err);
      res.redirect("back");
    }
    else {
      req.flash("success", "comment deleted!!");
      res.redirect("/main/" + req.params.id);
    }
  })
});



module.exports = router;
