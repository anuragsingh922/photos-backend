const connecttomongo = require('./db');
const express = require('express')
connecttomongo();
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require('path');


const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
const port = 8080;


app.use(express.json());
app.get("/", (req, res) => {
  res.send("Transcribe server is running... ");
});
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth' , require('./routes/auth'));
app.use('/api/photos' , require('./routes/photos'));

app.listen(port, () => {
  console.log(`App listening on port http://localhost:${port}`)
})
