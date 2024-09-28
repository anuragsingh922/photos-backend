require("dotenv").config({ path: "./config.env" });

const databaseuri = process.env.DATABASEURI;
const jwt_secret = process.env.JWT_SECRET;

module.exports = {databaseuri , jwt_secret}