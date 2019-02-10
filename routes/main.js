var express = require("express");
var router = express.Router();
var camp = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");




//INDEX ROUTE - the landing page
router.get("/", function (req, res) {
  res.render("main/home");
});


// Main Page Route showing our list of yelp camp
router.get("/main", function (req, res) {
  // get all camps from DB
  camp.find({}, function (err, allCamps) {
    if (err) {
      console.log(err);
    }
    else {
      res.render("main/main", { camps: allCamps, currentUser: req.user });
    }
  });
});

// only loggedIn user should be able to post, so i add func isLoggedIn to handle that.
// Route to add new camp
router.post("/main", middleware.isLoggedIn, function (req, res) {
  var name = req.body.name;
  var price = req.body.price;
  var image = req.body.image;
  var desc = req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username
  }

  var newCamp = {
    name: name,
    price: price,
    image: image,
    description: desc,
    author: author
  };
  //create a new camp and save to DB
  camp.create(newCamp, function (err, newlyCamp) {
    if (err) {
      console.log(err);
    }
    else {
      //redirect to camp list page
      console.log(newlyCamp);
      res.redirect("/main");
    }
  });
});

// Route - to show create form for new camp
// only loggedIn user should be able to view , so i add func isLoggedIn to handle that.
router.get("/main/new", middleware.isLoggedIn, function (req, res) {
  res.render("main/new");
});

// Route - to show more infomation on mouse click
router.get("/main/:id", function (req, res) {
  //find the camp with provided id
  camp.findById(req.params.id).populate("comments").exec(function (err, foundCamp) {
    if (err) {
      console.log(err);
    }
    else {
      console.log(foundCamp);
      //render moreInfo file template with that camp
      res.render("main/moreInfo", { camp: foundCamp });
    }
  });
});

//EDIT CAMP ROUTE
router.get("/main/:id/edit", middleware.checkCampOwnership, function (req, res) {
  camp.findById(req.params.id, function (err, foundCamp) {
    res.render("main/edit", { camp: foundCamp });
  });
});



//UPDATE CAMP ROUTE
router.put("/main/:id", middleware.checkCampOwnership, function (req, res) {
  //find and update the correct camp
  camp.findByIdAndUpdate(req.params.id, req.body.camp, function (err, foundUpdate) {
    if (err) {
      res.redirect("/main");
    }
    else {
      res.redirect("/main/" + req.params.id);
    }
  });
});


// DESTROY  CAMP ROUTE
router.delete("/main/:id", middleware.checkCampOwnership, function (req, res) {
  camp.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      res.redirect("/main");
    }
    else {
      res.redirect("/main");
    }
  });
});





module.exports = router;
