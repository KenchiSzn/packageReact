const mongoose = require("mongoose")

const PackageSchema = new mongoose.Schema({
    trackingNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },

       packageNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },

    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },

    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },

    origin: {
        type: String,
        required: true,
        trim: true,
    },

    destination: {
        type: String,
        required: true,
        trim: true,
    },

    packageType: {
        type: String,
        enum: [
            "document",
            "electronics",
            "clothing",
            "food",
            "fragile",
            "other",
        ],
        default: "other",
    },

    weight: {
        type: Number,
        required: true,
        min: 0,
    },

    currentLocation: {
        type: String,
        default: "",
        trim: true,
    },

    status: {
        type: String,
        enum: [
            "order_created",
            "picked_up",
            "processing",
            "in_transit",
            "arrived_at_distribution_center",
            "out_for_delivery",
            "delivered",
            "cancelled",
        ],
        default: "order_created",
    },

    estimatedDelivery: {
        type: Date,
    },

    assignedDriver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        default: null,
    },

    deliveredAt: {
        type: Date,
        default: null,
    },
},
    {
        timestamps: true,
    })

const PackageModel = mongoose.model('package', PackageSchema)
module.exports = PackageModel