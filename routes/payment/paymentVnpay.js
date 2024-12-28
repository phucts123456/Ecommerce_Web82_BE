const vnpayController = require('../../controllers/Payment/paymentVNPayController');
const router = require('express').Router();

router.post("/api/v1/payment/vnpay/create-payment-url", (req, res) => vnpayController.createPaymentUrl(req, res));

module.exports = router;