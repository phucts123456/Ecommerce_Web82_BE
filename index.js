const express = require('express');
const cors = require('cors')
const mongoose = require('mongoose');
const app = express();
const router = require('./routers');
app.use(express.json());
app.use(cors());
app.use(router);
const config = require("dotenv").config({ path: ".env" });

const connectDb = async () => {
    try {
      const userName = encodeURIComponent(process.env.MONGO_USERNAME);
      const password = encodeURIComponent(process.env.MONGO_PASSWORD);
      const cluster = encodeURIComponent(process.env.MONGO_CLUSTER);
      const database = encodeURIComponent(process.env.DB);
      await mongoose.connect(`mongodb+srv://${userName}:${password}@${cluster}/${database}`);
      console.log("Connect DB successfull");
    } catch (error) {
      console.log(error);
    }
  };
  connectDb();

app.listen('8080', () => {
    console.log("Server is running");
})