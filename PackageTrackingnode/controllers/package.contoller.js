const PackageModel = require("../models/package.model");
const TrackingModel = require("../models/trackinghistory.model");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer")


let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.APP_EMAIL,
    pass: process.env.APP_PASSWORD,
  },
});

const VALID_PACKAGE_STATUSES = [
  "order_created",
  "picked_up",
  "processing",
  "in_transit",
  "arrived_at_distribution_center",
  "out_for_delivery",
  "delivered",
  "cancelled",
];

const normalizeStatus = (value) => {
  if (typeof value !== "string") return value;

  return value.trim().toLowerCase().replace(/\s+/g, "_");
};

const isValidStatus = (value) => VALID_PACKAGE_STATUSES.includes(value);

const getAllowedDriverStatuses = (currentStatus) => {
  const sequence = [
    "order_created",
    "picked_up",
    "processing",
    "in_transit",
    "arrived_at_distribution_center",
    "out_for_delivery",
    "delivered",
  ];

  const currentIndex = sequence.indexOf(currentStatus);

  if (currentIndex === -1) {
    return []; 
  }

  if (currentStatus === "delivered") {
    return [];
  }

  return sequence.slice(currentIndex + 1, currentIndex + 2);
};

const createPackage = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).send({ message: "Forbidden resource" });
    }

    const number = `${Math.ceil(Math.random() * 10000000)}`.padStart(7, "0");
    const trackNum = `TRA-${number}`;

    const num = ``
    const packNum = num;

    const {
      sender,
      receiver,
      origin,
      destination,
      packageType,
      weight,
      estimatedDelivery,
      assignedDriver,
      status,
      currentLocation,
    } = req.body;

    if (!sender || !receiver || !origin || !destination || !weight) {
      return res.status(400).send({
        success: false,
        message: "Please provide all required package details",
      });
    }

    const normalizedStatus = normalizeStatus(status || "order_created");
    if (!isValidStatus(normalizedStatus)) {
      return res.status(400).send({
        success: false,
        message: "Invalid package status",
      });
    }

    const existingPackage = await PackageModel.findOne({
      packageNumber: packNum,
    });
    if (existingPackage) {
      return res.status(409).send({
        success: false,
        message: "Package number already exists",
      });
    }

    const newPackage = await PackageModel.create({
      packageNumber: packNum,
      trackingNumber: trackNum,
      sender,
      receiver,
      origin,
      destination,
      packageType,
      weight,
      estimatedDelivery: estimatedDelivery || null,
      assignedDriver: assignedDriver || null,
      currentLocation: currentLocation || origin,
      status: normalizedStatus,
    });

    await TrackingModel.create({
      package: newPackage._id,
      status: newPackage.status,
      location: newPackage.currentLocation || origin,
      description:
        newPackage.status === "order_created"
          ? "Package order has been created"
          : `Package status set to ${newPackage.status}`,
      updatedBy: req.user ? req.user.id : null,
    });

    const packageData = await PackageModel.findById(newPackage._id)
      .populate("sender", "firstname lastname email phone")
      .populate("receiver", "firstname lastname email phone")
      .populate("assignedDriver", "firstname lastname phone");

    if (packageData.receiver?.email) {
      const mailOptions = {
        from: process.env.APP_EMAIL,
        to: packageData.receiver.email,
        subject: `Get ready to receive your package ${packageData.receiver.firstname}`,
        text: `This is your tracking-ID ${packageData.trackingNumber}`,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.error("Package notification email error:", error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
    } else {
      console.error("Package notification email not sent: receiver email unavailable");
    }

    res.status(201).send({
      success: true,
      message: "Package created successfully",
      package: packageData,
    });
  } catch (error) {
    console.error("Create package error:", error);
    res.status(500).send({ success: false, message: "Server error" });
  }
};
const getAllPackages = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).send({
        message: "Forbidden resource",
      });
    }
    const packages = await PackageModel.find()
      .populate("sender", "firstname lastname email phone")
      .populate("receiver", "firstname lastname email phone")
      .populate("assignedDriver", "firstname lastname phone")
      .sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      count: packages.length,
      packages,
    });
  } catch (error) {
    console.error("Get packages error:", error);

    res.status(500).send({
      success: false,
      message: "Server error",
    });
  }
};

const getUserPackages = async (req, res) => {
  try {
    if (req.user.role !== "user") {
      return res.status(403).send({
        message: "Forbidden resource",
      });
    }
    const packages = await PackageModel.find({
      $or: [{ sender: req.user.id }, { receiver: req.user.id }],
    })
      .populate("sender", "firstname lastname email phone")
      .populate("receiver", "firstname lastname email phone")
      .populate("assignedDriver", "firstname lastname phone")
      .sort({ createdAt: -1 });

    return res.status(200).send({ success: true, packages });
  } catch (error) {
    console.error("Get customer packages error:", error);
    return res.status(500).send({ success: false, message: "Server error" });
  }
};

const getDriverPackages = async (req, res) => {
  try {
    if (req.user.role !== "driver") {
      return res.status(403).send({
        message: "Forbidden resource",
      });
    }
    const packages = await PackageModel.find({ assignedDriver: req.user.id })
      .populate("sender", "firstname lastname email phone")
      .populate("receiver", "firstname lastname email phone")
      .populate("assignedDriver", "firstname lastname phone")
      .sort({ createdAt: -1 });

    return res.status(200).send({ success: true, packages });
  } catch (error) {
    console.error("Get driver packages error:", error);
    return res.status(500).send({ success: false, message: "Server error" });
  }
};

const getPackageById = async (req, res) => {
  try {
    const packageData = await Package.findById(req.params.id)
      .populate("sender", "firstname lastname email phone")
      .populate("receiver", "firstname lastname email phone")
      .populate("assignedDriver", "firstname lastname phone");

    if (!packageData) {
      return res.status(404).send({
        success: false,
        message: "Package not found",
      });
    }

    res.status(200).send({
      success: true,
      package: packageData,
    });
  } catch (error) {
    console.error("Get package error:", error);

    res.status(500).send({
      success: false,
      message: "Server error",
    });
  }
};

const trackPackage = async (req, res) => {
  try {
    const trackingNumber = req.params.trackId?.trim();

    if (!trackingNumber) {
      return res.status(400).send({
        success: false,
        message: "Tracking number is required",
      });
    }

    const packageData = await PackageModel.findOne({
      trackingNumber,
    })
      .populate("sender", "firstname lastname")
      .populate("receiver", "firstname lastname")
      .populate("assignedDriver", "firstname lastname phone");

    if (!packageData) {
      return res.status(404).send({
        success: false,
        message: "Package not found",
      });
    }

    const history = await TrackingModel.find({
      package: packageData._id,
    })
      .populate("updatedBy", "firstname lastname role")
      .sort({ timestamp: -1 });

    res.status(200).send({
      success: true,
      package: packageData,
      history,
    });
  } catch (error) {
    console.error("Track package error:", error);

    res.status(500).send({
      success: false,
      message: "Server error",
    });
  }
};

const updatePackage = async (req, res) => {
  try {
    const {
      origin,
      destination,
      packageType,
      weight,
      estimatedDelivery,
      assignedDriver,
    } = req.body;

    const packageData = await Package.findByIdAndUpdate(
      req.params.id,
      {
        origin,
        destination,
        packageType,
        weight,
        estimatedDelivery,
        assignedDriver,
      },
      {
        new: true,
        runValidators: true,
      },
    )
      .populate("sender", "firstname lastname email phone")
      .populate("receiver", "firstname lastname email phone")
      .populate("assignedDriver", "firstname lastname phone");

    if (!packageData) {
      return res.status(404).send({
        success: false,
        message: "Package not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Package updated successfully",
      package: packageData,
    });
  } catch (error) {
    console.error("Update package error:", error);

    res.status(500).send({
      success: false,
      message: "Server error",
    });
  }
};

const updatePackageStatus = async (req, res) => {
  try {
    const { status, location, description } = req.body;

    if (!status || !location) {
      return res.status(400).send({
        success: false,
        message: "Status and location are required",
      });
    }

    const normalizedStatus = normalizeStatus(status);
    if (!isValidStatus(normalizedStatus)) {
      return res.status(400).send({
        success: false,
        message: "Invalid package status",
      });
    }

    const packageData = await PackageModel.findById(req.params.id);

    if (!packageData) {
      return res.status(404).send({
        success: false,
        message: "Package not found",
      });
    }

    const isAdmin = req.user.role === "admin";
    const isDriver = req.user.role === "driver";

    if (isDriver && packageData.assignedDriver?.toString() !== req.user.id) {
      return res.status(403).send({
        success: false,
        message: "You are not assigned to this package",
      });
    }

    if (isDriver && normalizedStatus !== "cancelled") {
      const allowed = getAllowedDriverStatuses(packageData.status);
      if (!allowed.includes(normalizedStatus)) {
        return res.status(400).send({
          success: false,
          message: `Drivers can only update status to ${allowed.join(", ") || "no further step"}`,
        });
      }
    }

    if (isDriver && normalizedStatus === "cancelled") {
      return res.status(403).send({
        success: false,
        message: "Drivers are not allowed to cancel a package",
      });
    }

    packageData.status = normalizedStatus;
    packageData.currentLocation = location;

    if (normalizedStatus === "delivered") {
      packageData.deliveredAt = new Date();
    }

    await packageData.save();

    await TrackingModel.create({
      package: packageData._id,
      status: normalizedStatus,
      location,
      description,
      updatedBy: req.user ? req.user.id : null,
    });

    const updatedPackage = await PackageModel.findById(packageData._id)
      .populate("sender", "firstname lastname email phone")
      .populate("receiver", "firstname lastname email phone")
      .populate("assignedDriver", "firstname lastname phone");

    res.status(200).send({
      success: true,
      message: "Package status updated successfully",
      package: updatedPackage,
    });
  } catch (error) {
    console.error("Update package status error:", error);

    res.status(500).send({
      success: false,
      message: "Server error",
    });
  }
};

const deletePackage = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).send({
        success: false,
        message: "Forbidden resource",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).send({
        success: false,
        message: "Invalid package ID",
      });
    }

    const packageData = await PackageModel.findById(req.params.id);

    if (!packageData) {
      return res.status(404).send({
        success: false,
        message: "Package not found",
      });
    }

    // Delete associated tracking history
    await TrackingModel.deleteMany({
      package: packageData._id,
    });

    // Delete package
    await PackageModel.findByIdAndDelete(packageData._id);

    res.status(200).send({
      success: true,
      message: "Package deleted successfully",
    });
  } catch (error) {
    console.error("Delete package error:", error);

    res.status(500).send({
      success: false,
      message: "Server error",
    });
  }
};


module.exports = {
  createPackage,
  getAllPackages,
  getPackageById,
  trackPackage,
  updatePackage,
  updatePackageStatus,
  deletePackage,
  getUserPackages,
  getDriverPackages,
};
