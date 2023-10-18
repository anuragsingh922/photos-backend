const mongoose = require('mongoose');
const mongoURI = "mongodb+srv://e-paras:anuraghanda@sentinal0.p3qhrm5.mongodb.net/";

const conecttomongo = () =>{
    mongoose.connect(mongoURI , ()=>{
        console.log("Connected to mongo successfully");
    })
}

module.exports = conecttomongo;