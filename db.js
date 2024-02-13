const mongoose = require('mongoose');
const mongoURI = "mongodb+srv://anuragjadu922:903BGnHp9ZdWz9h4@iitr-hackathon.wnk05ph.mongodb.net/";

const conecttomongo = () =>{
    mongoose.connect(mongoURI , ()=>{
        console.log("Connected to mongo successfully");
    })
}

module.exports = conecttomongo;