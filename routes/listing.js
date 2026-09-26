const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");

const {isLoggedIn} = require("../middleware.js");
const {isOwner} = require("../middleware.js");
const {validateListing} = require("../middleware.js");

const listingControllers = require("../controllers/listing.js");

const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});


//INDEX ROUTE
router.get("/", wrapAsync(listingControllers.index));

//CREATE ROUTE
router.get("/new", isLoggedIn, listingControllers.renderNewForm);
router.post("/", isLoggedIn, upload.single("listing[url]"), validateListing, wrapAsync(listingControllers.createListing));


//SHOW ROUTE
router.get("/:id", wrapAsync(listingControllers.showListing));

//EDIT ROUTE
router.get("/:id/edit",isOwner, isLoggedIn, wrapAsync(listingControllers.renderEditForm));

//UPDATE ROUTE
router.put("/:id",isOwner, isLoggedIn, upload.single("listing[url]"), validateListing, wrapAsync(listingControllers.updateListing));

//DELETE ROUTE
router.delete("/:id",isOwner, isLoggedIn, wrapAsync(listingControllers.destroyListing));

module.exports = router;