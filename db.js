const mongoose = require("mongoose");
require("dotenv").config({ path: "./config.env" });
const mongoURI = process.env.DATABASEURI;

const conecttomongo = () => {
  mongoose.connect(mongoURI, () => {
    console.log("Connected to mongo successfully");
  });
};

module.exports = conecttomongo;
