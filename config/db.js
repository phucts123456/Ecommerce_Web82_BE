const mongoose = require("mongoose");

const url = "mongodb+srv://phucts123456:Phucts@05012001@web82.0atpz.mongodb.net/";

async function connectTODB() {
  try {
    await mongoose.connect(url);
    console.log("Đã kết nối thành công với máy chủ");
  } catch (err) {
    console.log("Connect error:", err);
  }
}

module.exports = connectTODB;