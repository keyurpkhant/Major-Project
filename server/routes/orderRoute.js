const express = require("express");
const orderController = require("../controllers/orderController");
const router = express.Router();

router.post('/addOrder',orderController.addOrder);

router.get('/orders',orderController.getOrders);

module.exports = router;