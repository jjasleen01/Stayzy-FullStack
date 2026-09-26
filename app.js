if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate =  require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js")
const session = require("express-session");
const {MongoStore} = require("connect-mongo");

const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const users = require("./routes/user.js");


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.use(express.urlencoded({extended: true}));

app.use(methodOverride("_method"));

app.engine("ejs", ejsMate);

app.use(express.static(path.join(__dirname, "/public")));


let port = 8080;
app.listen(port, ()=>{
    console.log("port is listening...");
})

const dbUrl = process.env.ATLASDB_URL;

main()
.then(()=>{
    console.log("working...");
})
.catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect(dbUrl);
}

// //root path
// app.get("/", (req,res)=>{
//     res.send("Hi! I am the root");
// })

// //test listings
// app.get("/testListing", async (req,res)=>{
//     let sampleListing = new Listing({
//         title: "My Home",
//         description: "Home Sweet Home",
//         image: "https://unsplash.com/photos/white-and-red-house-near-lake-and-green-trees-during-daytime-RlQ29vvbU2Q",
//         price: 12000,
//         location: "Bali",
//         country: "India",
//     });
//     await sampleListing.save();
//     console.log("sample was saved!");
//     res.send("sample saved...");
// });

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto:{
        secret: process.env.SECRET,
    },
    touchAfter: 24*3600,
});

store.on("error", ()=>{
    console.log("ERROR:", err);
});

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now() + 7 * 24* 60* 60* 1000,
        maxAge: 7 * 24* 60* 60* 1000,
        httpOnly: true,
    },
}
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// app.get("/demouser", async (req, res)=>{
//      let fakeUser = await new User(
//         {
//             email: "abcdef@gmail.com",
//             username: "abcdef",
//         })
//         let registeredUser = await User.register(fakeUser, "mypassword");
//         console.log(registeredUser);
//         res.send(registeredUser);
// })

app.use((req, res, next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

//listing.js and review.js
app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);

app.use("/", users);


app.all("/{*splat}", (req, res, next)=>{
    next(new ExpressError(404, "Page not found"));
})

app.use((err, req, res, next)=>{
   let{statusCode=500, message= "Something went wrong!"} = err;
   res.render("listings/error.ejs", {message});
})