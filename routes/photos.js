const express = require("express");
const Image = require("../models/Photos");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const multer = require("multer");
const path = require("path");

router.use(fetchuser);

router.get("/", async (req, res) => {
  console.log("Called");
  try {
    const email = req.user;

    console.log("Email: " + email);

    // Find all images associated with the provided email
    const images_res = await Image.find({ email }).sort({date : -1});
    console.log("Database: ", images_res);

    res.status(200).send(images_res); // Sending JSON response with the retrieved images
  } catch (err) {
    console.log("Error: ", err);
    res.status(500).send(err); // Sending error response
  }
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

router.post("/", upload.single("file"), async (req, res) => {
  console.log(JSON.stringify(req.body));
  try {
    const newImage = new Image({
      filename: req.file.originalname,
      filepath: req.file.path,
      type: req.file.mimetype,
      email: req.body.email,
    });
    await newImage.save();
    res.send("Image uploaded successfully");
  } catch (error) {
    res.status(500).send("Error uploading image");
    console.log("error ", error);
  }
});


router.post("/delete", async (req, res) => {
  try {
    console.log(JSON.stringify(req.body));
    const {id} = req.body;
    await Image.findByIdAndDelete(id);
    res.send("Image deleted successfully");
  } catch (error) {
    res.status(500).send("Error uploading image");
    console.log("error ", error);
  }
});

module.exports = router;
