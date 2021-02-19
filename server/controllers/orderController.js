var mongoose = require("mongoose");
const orderSchema = require('../models/orderModel');
const restaurantSchema = require('../models/restaurantModel');
const userSchema = require('../models/userModel');
const app = require("../server");

let orderDataCollection = mongoose.model('order', orderSchema, 'orders');
let restaurantDataCollection = mongoose.model('restaurant', restaurantSchema, 'restaurants');
let userDataCollection = mongoose.model('user', userSchema, 'users');

exports.getOrders = async (req, res, next) => {
    let userId = mongoose.Types.ObjectId(req.body.userId);
    console.log(userId);

    let orders = await orderDataCollection.find({ userId: userId });
    console.log(orders);

    res.send(orders);
}

exports.addOrder = async (req, res, next) => {
    let userId = req.body.userId;

    let deliveryExecutive = req.body.deliveryExecutive;

    let orderOtp = generateOTP();

    let userCart = await userDataCollection.findById(userId, { cart: 1 });

    // let totalAmount = 0;

    let foodList = userCart.cart.foodList;

    let restaurantMenu = await restaurantDataCollection.findById(userCart.cart.restaurantId, { menuDetails: 1, restaurantName: 1 })


    let orderFoodList = getFoodList(foodList, restaurantMenu);

    // foodList.forEach((element) => {
    //     let foodItem = restaurantMenu.menuDetails.find((x) => {
    //         console.log("x:", x);
    //         return x._id.toString() == element.foodId;
    //     })
    //     orderFoodList.push({ foodItem: foodItem, quantity: element.quantity });
    //     totalAmount += (foodItem.foodPrice) * element.quantity;
    // });

    console.log("Total amount:", totalAmount);

    let orderObj = new orderDataCollection({
        userId: userId,
        orderLocation: req.body.orderLocation,
        totalAmount: orderFoodList.totalAmount,
        orderOtp: parseInt(orderOtp),
        orderStatus: 'ordered',
        orderDateAndTime: Date.now(),
        foodList: orderFoodList.foodList,
        restaurantDetails: {
            restaurantId: restaurantMenu._id,
            restaurantName: restaurantMenu.restaurantName
        },
        deliveryExecutive: deliveryExecutive
    })

    orderObj.save(function (err, order) {
        if (err) console.log(err.message);
        else {
            console.log("Order Data======>", order);
        }
    })
}

function generateOTP() {

    // Declare a digits variable  
    // which stores all digits 
    var digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < 4; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
}

// get foodList from cart and from restaurant details
function getFoodList(foodList, restaurantMenu) {

    orderFoodList = [];
    foodList.forEach((element) => {
        let foodItem = restaurantMenu.menuDetails.find((x) => {
            console.log("x:", x);
            return x._id.toString() == element.foodId;
        })
        totalAmount += (foodItem.foodPrice) * element.quantity;
        orderFoodList.push({foodList:{ foodItem: foodItem, quantity: element.quantity }, totalAmount:totalAmount});
    });

    return orderFoodList;
}