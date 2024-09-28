const express = require("express");
const router = express.Router();
const multer = require("multer");
const fetchuser = require("../middleware/fetchuser");

router.use(fetchuser);

const storage = multer.memoryStorage();

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./uploads");
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + path.extname(file.originalname));
//   },
// });

const upload = multer({ storage: storage });

const { uploadFile, getAllFiles } = require("../controller/gridfsController");

router.post("/", upload.single("file") , uploadFile);
router.get("/" , getAllFiles);

module.exports = router;
