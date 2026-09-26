const express = require("express");
const router = express.Router({mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");

const {validateReview} = require("../middleware.js");
const {isReviewAuthor} =  require("../middleware.js");
const {isLoggedIn} =  require("../middleware.js");

const reviewControllers = require("../controllers/review.js");

//REVIEWS ROUTE
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewControllers.createReview));

//REVIEWS DELETE ROUTE
router.delete("/:reviewId",isLoggedIn, isReviewAuthor, wrapAsync(reviewControllers.destroyReview));

module.exports = router;