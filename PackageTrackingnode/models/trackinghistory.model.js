const mongoose = require("mongoose");

const trackingHistorySchema = new mongoose.Schema(
  {
    package: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Package",
      required: true,
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
      required: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },

    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const TrackingModel = mongoose.model ('trackinghistory', trackingHistorySchema)
module.exports = TrackingModel