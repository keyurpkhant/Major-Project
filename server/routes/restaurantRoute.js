const express = require("express");
const restaurantController = require("../controllers/restaurantController");
const router = express.Router();

router.get('/getRestaurants', restaurantController.getRestaurants);

router.post('/addRestaurant', restaurantController.addRestaurant);

router.get('/topRestaurants', restaurantController.getTopRestaurants);

router.get('/getRestaurantById', restaurantController.getRestaurantById);

// router.get('/topFoods',restaurantController.getTopFood);

router.get('/searchRestaurants', restaurantController.searchRestaurants);

module.exports = router;