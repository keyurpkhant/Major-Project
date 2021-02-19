// const jwt = require('jsonwebtoken');
var mongoose = require("mongoose");

const userSchema = require('../models/userModel');

const app = require("../server");

// user schema
const userDataCollection = mongoose.model('user', userSchema, 'users');


// Get all users
exports.getUsers =async (req, res, next) => {
    let users=await userDataCollection.find({});
    res.send(users);
}


// To register user
exports.addUser = (req, res, next) => {

    let userObj;
    if (req.body.role == 'de') {
        userObj = new userDataCollection({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password,
            gender: req.body.gender,
            mobileNumber: req.body.mobileNumber,
            role: req.body.role,
            deliveryExecutive: {
                vehicleNumber: req.body.vehicleNumber,
                deliveryExecutiveLocation: {
                    streetAddress: req.body.streetAddress,
                    city: req.body.city,
                    zip: req.body.zip,
                    state: req.body.state,
                    country: req.body.country,
                    latitude: req.body.latitude,
                    longitude: req.body.longitude,
                },
                activityStatus: req.body.activityStatus
            }
        });
    }
    else {
        userObj = new userDataCollection({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password,
            gender: req.body.gender,
            mobileNumber: req.body.mobileNumber,
            role: req.body.role
        });
    }

    userObj.save(function (err, user) {
        if (err) console.log(err.message);
        else {
            console.log("User Data======>", user);
        }
    })

}


// update profile data of user
exports.updateUser =async (req, res, next) => {
    let id = req.query.id;
    let updateData = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        mobileNumber: req.body.mobileNumber
    }
    await userDataCollection.findByIdAndUpdate(id, updateData);
}


// user authentication login 
exports.loginUser =async (req, res, next) => {
    let email = req.body.email;
    let password = req.body.password;
    let user=await userDataCollection.find({ 'email': email }, { 'email': 1, 'password': 1 })

            if (user != null) {
                if (password === user.password) {
                    console.log("User Logged in Successfully");
                }
                else {
                    console.log("Wrong Password");
                }
            }
            else {
                console.log("User doesn't Exist");
            }
}


// Add to cart
exports.addToCart = async (req, res, next) => {
    let id = req.body.userId;
    const foodItem = req.body.foodItem;
    const restaurantId = req.body.restaurantId;

    if (req.body.role == "user") {

        let existingCart = await userDataCollection.findById(id, { cart: 1 });
        console.log(existingCart);
        if (existingCart.cart == undefined) {

            let cart = {
                // userId:req.body.userId,
                restaurantId: restaurantId,
                foodList: [foodItem]
            }
            let result = await userDataCollection.findByIdAndUpdate(id, { "cart": cart });
            console.log(result);
        } else {
            if (existingCart.cart.restaurantId.toString() === restaurantId) {
                let foodIndex = existingCart.cart.foodList.findIndex((food) => {
                    return food.foodId.toString() == foodItem.foodId;
                });

                if (foodIndex != -1) {
                    if (foodItem.quantity) {

                    }
                    existingCart.cart.foodList[foodIndex].quantity += 1;
                }
                else {
                    existingCart.cart.foodList.push(foodItem);
                }
                await userDataCollection.findByIdAndUpdate(id, { "cart": existingCart.cart });
            } else {

            }

        }
    }
}

exports.reduceCartItem = async (req, res, next) => {
    let id = req.body.userId;
    const foodItem = req.body.foodItem;
    const restaurantId = req.body.restaurantId;

    if (req.body.role == "user") {
        let existingCart = await userDataCollection.findById(id, { cart: 1 });

        if (existingCart.cart.foodList.length==1 && existingCart.cart.foodList[0].quantity==1) {
            await userDataCollection.findByIdAndUpdate(id, { "cart": undefined });
        }
        else{
            let foodIndex = existingCart.cart.foodList.findIndex((food) => {
                return food.foodId.toString() == foodItem.foodId;
            });
            if(existingCart.cart.foodList[foodIndex].quantity==1){
                existingCart.cart.foodList=existingCart.cart.foodList.filter((x)=>{return x.foodId.toString()!=foodItem.foodId});
            }
            else{
                existingCart.cart.foodList[foodIndex].quantity-=1;
            }
            await userDataCollection.findByIdAndUpdate(id, { "cart": existingCart.cart });
        }

    }
}

exports.clearCart=async (req,res,next)=>{
    let id = req.body.userId;
    await userDataCollection.findByIdAndUpdate(id, { "cart": undefined });
}


