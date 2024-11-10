const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const router = require("./routes/index.js");
const cloudinary = require('cloudinary').v2;
const config = require("dotenv").config({ path: ".env" });
var bodyParser = require('body-parser');
const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});
app.use(cors());
app.use(router);

const connectDb = async () => {
  try {
    const userName = encodeURIComponent(process.env.MONGO_USERNAME);
    const password = encodeURIComponent(process.env.MONGO_PASSWORD);
    const cluster = encodeURIComponent(process.env.MONGO_CLUSTER);
    const database = encodeURIComponent(process.env.DB);
    await mongoose.connect(
      `mongodb+srv://${userName}:${password}@${cluster}/${database}`
    );
    console.log("Connect DB successfull");
  } catch (error) {
    console.log(error);
  }
};
connectDb();

app.listen("8080", () => {
  console.log("Server is running");
});
