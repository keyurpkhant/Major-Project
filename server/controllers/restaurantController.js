var mongoose = require("mongoose");
const restaurantSchema = require('../models/restaurantModel');
// const foodSchema = require('../models/foodModel');
const app = require("../server");
// const categorySchema = require("../models/categoryModel");

restaurantSchema.index({ '$**': 'text' });
const restaurantDataCollection = mongoose.model('restaurant', restaurantSchema, 'restaurants');

exports.getRestaurants = (req, res, next) => {
    restaurantDataCollection.aggregate([
        {
            "$addFields": {
                "rating_avg": {
                    "$avg": {
                        "$map": {
                            "input": "$restaurantRatings",
                            "as": "restRating",
                            "in": "$$restRating.rating"
                        }
                    }
                }
            }
        }
    ]).exec(function (err, result) {
        if (err) throw err;
        console.log(result);
        res.send(result);
    });
}


exports.getRestaurantById = (req, res, next) => {
    let id = mongoose.Types.ObjectId(req.body.id);

    restaurantDataCollection.aggregate([{ "$match": { "_id": id } },
    {
        "$addFields": {
            "rating_avg": {
                "$avg": {
                    "$map": {
                        "input": "$restaurantRatings",
                        "as": "restRating",
                        "in": "$$restRating.rating"
                    }
                }
            }
        }
    }
    ])
        .exec(function (err, result) {
            if (err) throw err;
            console.log(result);
            res.send(result);
        });
}

exports.addRestaurant = (req, res, next) => {
    let restaurantObj = new restaurantDataCollection(
        req.body
    )
    restaurantObj.save(function (err, val) {
        if (err) console.log(err.message);
        else {
            console.log("Rest Data======>", val);
        }
    })
}

exports.getTopRestaurants = (req, res, next) => {
    restaurantDataCollection.aggregate([
        {
            "$addFields": {
                "rating_avg": {
                    "$avg": {
                        "$map": {
                            "input": "$restaurantRatings",
                            "as": "restRating",
                            "in": "$$restRating.rating"
                        }
                    }
                }
            }
        },
        { "$sort": { "rating_avg": -1 } }
    ])
        .limit(6)
        .exec(function (err, result) {
            if (err) throw err;
            console.log(result);
            res.send(result);
        });
}


exports.searchRestaurants = (req, res, next) => {
    let search = req.body.search;
    let city = req.body.city;
    restaurantDataCollection.find({
        $text: {
            $search: search,
            $search: city
        }
    })
        .exec(function (err, result) {
            if (err) throw err;
            console.log(result);
            res.send(result);
        });
}


// exports.getTopFood = (req, res, next) => {
//     restaurantDataCollection.aggregate([
//         {
//             "$addFields": {
//                 "menuDetails.foodRating_avg": {
//                         "$map": {
//                             "input": "$menuDetails",
//                             "as": "food",
//                             "in": {
//                                 "$avg": {

//                                         "$food.foodRating.$rating"

//                                 }
//                             }


//                         }

//                 }
//             }
//         },
//         { "$sort": { "menuDetails.foodRating_avg": -1 } }
//     ])
//         .limit(5)
//         .exec(function (err, result) {
//             if (err) throw err;
//             console.log(result);
//             res.send(result);
//         });
// }