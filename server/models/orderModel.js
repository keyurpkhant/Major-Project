const mongoose = require('mongoose');
const addressSchema = require('./addressModel');
const foodSchema = require('./foodModel');

const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "userSchema",
        },
        orderLocation: {
            type: addressSchema,
            required: true
        },
        totalAmount: {
            type: Number,
            required: true
        },
        orderOtp: {
            type: Number,
            required: true,
        },
        orderStatus:
        {
            // ordered: {
            //     type: Boolean,
            //     required: true
            // },
            // accepted: {
            //     type: Boolean,
            //     required: true
            // },
            // cooking: {
            //     type: Boolean,
            //     required: true
            // },
            // outOfDelivery: {
            //     type: Boolean,
            //     required: true
            // },
            // delivered: {
            //     type: Boolean,
            //     required: true
            // },
            // cancelled: {
            //     type: Boolean,
            //     required: true
            // }
            type: String,
            enum: ['ordered', 'accepted', 'cooking', 'outfordelivery', 'delivered', 'cancelled'],
            required: true,
        },
        orderDateAndTime: {
            type: Date,
            required: true,
            default: Date.now
        },
        foodList: [
            {
                _id: false,
                foodItem: { type: foodSchema, required: true },
                quantity: { type: Number, required: true }
            }
        ],
        restaurantDetails: {
            restaurantId: {
                type: mongoose.Types.ObjectId,
                required: true,
                ref: 'restaurant'
            },
            restaurantName: {
                type: String,
                required: true
            }
        },
        deliveryExecutive: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
        },
    }
)

module.exports = orderSchema;