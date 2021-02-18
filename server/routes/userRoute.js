const express = require("express");
// const { body } = require("express-validator");

const userController = require("../controllers/userController");
// const auth = require("../middleware/auth");

const router = express.Router();

router.get('/users', userController.getUsers);

router.post('/addUser',userController.addUser);

router.put('/updateUser/:id',userController.updateUser);

router.get('/login', userController.loginUser);

router.put('/addToCart',userController.addToCart);

module.exports = router;