const express = require("express");
// const { body } = require("express-validator");

const userController = require("../controllers/userController");
// const auth = require("../middleware/auth");

const router = express.Router();

router.get('/users', userController.getUsers);

router.post('/addUser',userController.addUser);

module.exports = router;