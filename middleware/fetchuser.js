const jwt = require("jsonwebtoken");
const jwt_str = "Anuragisgoodb$oy";

const fetchuser = (req, res, next) => {
  const token = req.header("authorization");
  if (!token) {
    console.log("Token Not present.");
    res.status(401).send({ error: "Please enter valid details" });
  } else {
    try {
      const data = jwt.verify(token, jwt_str);
      req.user = data;
      next();
    } catch (error) {
      console.log("Error in middleware : " , error);
      res.status(401).send({ error: "Please enter valid details" });
    }
  }
};

module.exports = fetchuser;
