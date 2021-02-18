// const jwt = require('jsonwebtoken');
var mongoose = require("mongoose");

const userSchema = require('../models/userModel');

const app = require("../server");

const userDataCollection = mongoose.model('user', userSchema, 'users');

exports.getUsers = (req, res, next) => {
    //const userDataCollection = mongoose.model('user', userSchema, 'users');
    userDataCollection.find(function (err, user) {
        if (err) {
            console.error(err);
        }
        res.status(200).json({
            users: user
        })
    });
}

exports.addUser = (req, res, next) => {
    //const userDataCollection = mongoose.model('user', userSchema, 'users');
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

exports.updateUser = (req, res, next) => {
    // const userDataCollection = mongoose.model('user', userSchema, 'users');
    let id = req.params.id;
    let updateData = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        mobileNumber: req.body.mobileNumber
    }
    userDataCollection.findByIdAndUpdate(id, updateData, function (err, res) {
        if (err) console.log(err.message);
        else {
            console.log("Data updated ", res);
        }
    });
}

exports.loginUser = (req, res, next) => {
    // const userDataCollection = mongoose.model('user', userSchema, 'users');
    let email = req.body.email;
    let password = req.body.password;
    userDataCollection.find({ 'email': email }, { 'email': 1, 'password': 1 }, function (err, data) {
        if (err) console.log(err.message);
        else {
            if (data != null) {
                if (password === data.password) {
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
    });
}

exports.addToCart=async (req,res,next)=>{
    let id=req.body.id;
    // let cart={
    //     restaurantId: req.params.restaurantId,
    //     foodList:req.params.foodList
    // }

    if(req.body.role=="user"){
    
        let existingCart=await userDataCollection.findById(id,{cart:1});
        if(existingCart==null){
            
        }
        console.log(existingCart);
        // userDataCollection.findByIdAndUpdate(id,{"cart":cart})
    }
}