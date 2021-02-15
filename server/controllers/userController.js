// const jwt = require('jsonwebtoken');
var mongoose = require("mongoose");

const dotenv = require('dotenv');
const userSchema = require('../models/userModel');

const app = require("../server");

exports.getUsers = (req, res, next) => {
    const userDataCollection = mongoose.model('user', userSchema, 'users');
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
    const userDataCollection = mongoose.model('user', userSchema, 'users');
    let userObj;
    if(req.body.role == 'de'){
        userObj = new userDataCollection({        
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password,
            gender: req.body.gender,
            mobileNumber: req.body.mobileNumber,
            role: req.body.role,
            deliveryExecutive:{
                vehicleNumber: req.body.vehicleNumber,
                deliveryExecutiveLocation:{
                    streetAddress:req.body.streetAddress,
                    city:req.body.city,
                    zip:req.body.zip,
                    state:req.body.state,
                    country:req.body.country,
                    latitude:req.body.latitude,
                    longitude:req.body.longitude, 
                },
                activityStatus:req.body.activityStatus,
                // deliveryExecutiveRatings:[]
            }
        });
    }
    else{
        userObj = new userDataCollection({        
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password,
            gender: req.body.gender,
            mobileNumber: req.body.mobileNumber,
            role: req.body.role,
        });
    }    

    userObj.save(function (err, user) {
        if (err) console.log(err.message);
        else {
            console.log("User Data======", user);
        }
    })


}