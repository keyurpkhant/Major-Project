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
    let id = mongoose.Types.ObjectId(req.query.id);

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


exports.searchRestaurants = async (req, res, next) => {
    let search = req.body.search;
    let city = req.body.city;
    let searchRestaurants = await restaurantDataCollection.find({
        $text: {
            $search: search,
            $search: city
        }
    }).catch((err) => {
        res.send(err)
    });

    res.send(searchRestaurants);

}


exports.getTopFood = async (req, res, next) => {
    let city="Ahmedabad";
    let rest = await restaurantDataCollection.find({'restaurantLocation.city':city}).select('menuDetails');
    let foodlist = [];
    let ratings = [];
    var temp;
    rest.forEach((element, index) => {

        element.menuDetails.forEach((food) => {
            let avgRating = 0;
            if (food.foodRating != undefined && food.foodRating.length > 0)
                avgRating = food.foodRating.reduce((total, current) =>  total + current.rating , 0) / food.foodRating.length;
            foodlist.push({ restaurantId: element._id.toString(), food: food, avgRating: avgRating })
        })
    })

    foodlist = foodlist.sort(function(a,b){
        return (a.avgRating<b.avgRating) ? 1 :-1; 
    })

    res.send(foodlist);
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