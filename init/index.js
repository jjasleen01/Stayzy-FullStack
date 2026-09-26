const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

//connection to mongoose
const MongoUrl = "mongodb://127.0.0.1:27017/stayzy";
main()
.then(()=>{
    console.log("working...");
})
.catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect(MongoUrl);
}

const initDb = async() =>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({...obj, owner:"6ab3a02fbb028c899b99f82f"}));
    await Listing.insertMany(initData.data);
    console.log("Data inserted...");
}
//calling the function
initDb();