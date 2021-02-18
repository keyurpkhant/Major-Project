var mongoose = require("mongoose");
const orderSchema = require('../models/orderModel');
const app = require("../server");

let orderDataCollection= mongoose.model('order',orderSchema,'orders');
