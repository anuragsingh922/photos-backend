const express = require('express');
const Image = require('../models/Photos');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const multer = require('multer');
const path = require('path');

router.get('/getphotos', async (req, res) => {
    try {
        const email = req.query.email;

        console.log("Email: " + email);

        // Find all images associated with the provided email
        const images_res = await Image.find({ email });
        console.log("Database: ", images_res);

        res.json(images_res); // Sending JSON response with the retrieved images
    } catch (err) {
        console.log("Error: ", err);
        res.status(500).send(err); // Sending error response
    }
});


const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
    }
  });
  
  const upload = multer({ storage: storage });

router.post('/upload' , upload.single('image') , async(req,res)=>{

    console.log(JSON.stringify(req.body));
    try {
        const newImage = new Image({
          filename: req.file.originalname,
          filepath: req.file.path,
          email : req.body.email,
        });
        await newImage.save();
        res.send('Image uploaded successfully');
      } catch (error) {
        res.status(500).send('Error uploading image');
        console.log("error " , error);
      }
});

module.exports = router;