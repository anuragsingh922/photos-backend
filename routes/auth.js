const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");
// const { findById } = require('../models/User');
const { jwt_secret } = require("../config");

router.post("/home", async (req, res) => {
  res.send("Home");
});

router.post(
  "/signup",
  [
    body("name", "Enter valid name"),
    body("email", "Enter valid email").isEmail(),
    body("password", "Enter valid password").isLength({ min: 5 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    let success = false;
    if (!errors.isEmpty()) {
      return res.status(400).json({ success : false, msg: errors.array() });
    }

    try {
      let user = await User.findOne({ email: req.body.email });
      // let al = false;

      if (user) {
        // al = true;
        return res
          .status(400)
          .json({ success : false, msg: "Account already exist." });
      }

      const salt = await bcrypt.genSalt(10);
      const secpass = await bcrypt.hash(req.body.password, salt);

      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secpass,
      });

      console.log(user);

      const authtoken = jwt.sign(user.email, jwt_secret);
      success = true;
      res.json({ success, authtoken });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({success : false , msg : "Please try after some time."});
    }

    //     .then(user => res.json(user))
    //     .catch(err=>{console.log(err)
    // res.json({error:'please enter a unique valid email' , message:err.message})});
  }
);

// Login token authentication :

router.post(
  "/login",
  [
    body("email", "Enter valid email").isEmail(),
    body("password", "Password cannot be blank".exists),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(404).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let success = false;

      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ errors: "Please create your account on WeCare" });
      }

      const passwordcompare = await bcrypt.compare(password, user.password);
      if (!passwordcompare) {
        return res.status(400).json({ errors: "Invalid Username or Password" });
      }

      const authtoken = jwt.sign(user.email, jwt_secret);
      success = true;
      res.json({ success, authtoken, user });
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal server error occured");
    }
  }
);

// Logging user with the help of token :

router.post("/getuser", fetchuser, async (req, res) => {
  let success = false;

  try {
    let userid = req.user.id;
    let user = await User.findById(userid).select("-password");
    success = true;
    res.json({ success, user });
    // res.send(user , success);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal server occured");
  }
});

module.exports = router;
