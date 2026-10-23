const TrackingHistory = require("../models/trackinghistory.model");
const Package = require("../models/package.model")

const addTrackingHistory = async (req, res) => {
  try {
    const {
      packageId,
      status,
      location,
      description,
    } = req.body;

    if (!packageId || !status || !location) {
      return res.status(400).send({
        success: false,
        message: "Package, status and location are required",
      });
    }

    // Check package
    const packageData = await Package.findById(packageId);

    if (!packageData) {
      return res.status(404).send({
        success: false,
        message: "Package not found",
      });
    }

    // Create history
    const history = await TrackingHistory.create({
      package: packageId,
      status,
      location,
      description,
      updatedBy: req.user ? req.user.id : null,
    });

    // Update package current status
    packageData.status = status;
    packageData.currentLocation = location;

    if (status === "delivered") {
      packageData.deliveredAt = new Date();
    }

    await packageData.save();

    const historyData = await TrackingHistory.findById(history._id)
      .populate("package", "trackingNumber")
      .populate("updatedBy", "firstname lastname role");

    res.status(201).send({
      success: true,
      message: "Tracking history added successfully",
      history: historyData,
    });
  } catch (error) {
    console.error("Add tracking history error:", error);

    res.status(500).send({
      success: false,
      message: "Server error",
    });
  }
};

const getPackageHistory = async (req, res) => {
  try {
    const { packageId } = req.params;

    const packageData = await Package.findById(packageId);

    if (!packageData) {
      return res.status(404).send({
        success: false,
        message: "Package not found",
      });
    }

    const history = await TrackingHistory.find({
      package: packageId,
    })
      .populate("updatedBy", "firstname lastname role")
      .sort({ timestamp: -1 });

    res.status(200).send({
      success: true,
      trackingNumber: packageData.trackingNumber,
      count: history.length,
      history,
    });
  } catch (error) {
    console.error("Get package history error:", error);

    res.status(500).send({
      success: false,
      message: "Server error",
    });
  }
};

const getTrackingHistoryById = async (req, res) => {
  try {
    const history = await TrackingHistory.findById(
      req.params.id
    )
      .populate("package", "trackingNumber status")
      .populate("updatedBy", "firstname lastname role");

    if (!history) {
      return res.status(404).send({
        success: false,
        message: "Tracking history not found",
      });
    }

    res.status(200).send({
      success: true,
      history,
    });
  } catch (error) {
    console.error("Get tracking history error:", error);

    res.status(500).send({
      success: false,
      message: "Server error",
    });
  }
};

const deleteTrackingHistory = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).send({
        success: false,
        message: "Forbidden resource",
      });
    }

    const history = await TrackingHistory.findByIdAndDelete(
      req.params.id
    );

    if (!history) {
      return res.status(404).send({
        success: false,
        message: "Tracking history not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Tracking history deleted successfully",
    });
  } catch (error) {
    console.error("Delete tracking history error:", error);

    res.status(500).send({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  addTrackingHistory,
  getPackageHistory,
  getTrackingHistoryById,
  deleteTrackingHistory,
};