const jwt = require('jsonwebtoken');


const jwtCheckMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if(authHeader) {
        const token = authHeader.split(' ')[1]; // Tách access token từ chuỗi "Bearer {access_token}"
        console.log("token")
        console.log(token)
        const secretKey = process.env.ACCESSS_TOKEN_SECERT_KEY;
        // Xác thực access token
        jwt.verify(token, secretKey, (err, decoded) => {
          if (err) {
            return res.status(401).json({ success: false, msg: err.message});
          } else {
            // Lưu thông tin người dùng từ access token vào req
            // tham số req sẽ được chuyển tiếp tới các handler tiếp theo
            req.user = decoded; 
            next();
          }
        });
    } else {
      res.status(401).json({ message: 'Access token is missing' });
    }
}

module.exports = {
  jwtCheckMiddleware
}