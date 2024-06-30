const mongoose = require("mongoose");
const inventoryModel = require("../models/inventoryModel");
const userModel = require("../models/userModel");

// CREATE INVENTORY

const cerateInventoryController = async (req, res) => {
  try {
    const { email } = req.body;
    // validation
    const user = await userModel.findOne({ email });
    if (!user) {
      throw new Error("User Not Found");
    }
    // if (inventoryType === "in" && user.role !== "donar") {
    //   throw new Error("Not a donar account");
    // }
    // if (inventoryType === "out" && user.role !== "hospital") {
    //   throw new Error("Not a Hospital");
    // }

    if (req.body.inventoryType == "out") {
      const requestedBloodGroup = req.body.bloodGroup;
      const requestedQuantityOfBlood = req.body.quantity;
      const organization = new mongoose.Types.ObjectId(req.body.userId);
      // calculate Blood Quantity
      const totalInOfRequestedBlood = await inventoryModel.aggregate([
        {
          $match: {
            organization,
            inventoryType: "in",
            bloodGroup: requestedBloodGroup,
          },
        },
        {
          $group: {
            _id: "$bloodGroup",
            total: { $sum: "$quantity" },
          },
        },
      ]);
      // console.log("Total In", totalInOfRequestedBlood);
      const totalIn = totalInOfRequestedBlood[0]?.total || 0;

      // CALCULATE OUT BLOOD QUANTITY

      const totalOutOfRequestedBloodGroup = await inventoryModel.aggregate([
        {
          $match: {
            organization,
            inventoryType: "out",
            bloodGroup: requestedBloodGroup,
          },
        },
        {
          $group: {
            _id: "$bloodGroup",
            total: { $sum: "$quantity" },
          },
        },
      ]);
      const totalOut = totalOutOfRequestedBloodGroup[0]?.total || 0;

      //IN & OUT CALCULATION

      const availableQuantityOfBloodGroup = totalIn - totalOut;
      // QUANTITY VALIDATION
      if (availableQuantityOfBloodGroup < requestedQuantityOfBlood) {
        return res.status(500).send({
          success: false,
          message: `Only ${availableQuantityOfBloodGroup}ML of ${requestedBloodGroup.toUpperCase()} is available`,
        });
      }
      req.body.hospital = user?._id;
    } else {
      req.body.donar = user?._id;
    }
    // save record
    const inventory = new inventoryModel(req.body);
    await inventory.save();
    return res.status(201).send({
      success: true,
      message: "New Blood Record Added",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In Create Inventory API",
      error,
    });
  }
};
// GET ALL BLOOD RECORDS
const getInventoryController = async (req, res) => {
  try {
    const inventory = await inventoryModel
      .find({ organization: req.body.userId })
      .populate("donar")
      .populate("hospital")
      .sort({ createdAt: -1 });
    return res.status(200).send({
      success: true,
      message: "get all records successfully",
      inventory,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In Get All Inventory",
    });
  }
};

// GET Hospital BLOOD RECORDS

const getInventoryHospitalController = async (req, res) => {
  try {
    const inventory = await inventoryModel
      .find(req.body.filters)
      .populate("donar")
      .populate("hospital")
      .populate("organization")
      .sort({ createdAt: -1 });
    return res.status(200).send({
      success: true,
      message: "get Hospital consumer records successfully",
      inventory,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In Get Consumer Inventory",
    });
  }
};

//GET BLOOD RECORD OF 3
const getRecentInventoryController = async (req, res) => {
  try {
    const inventory = await inventoryModel
      .find({ organization: req.body.userId })
      .limit(3)
      .sort({ createdAt: -1 });
    return res.status(200).send({
      success: true,
      message: "Recent Inventory Data Fetched",
      inventory,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error In Recent Inventory API",
      error,
    });
  }
};

// GET DONAR RECORD

const getDonorsController = async (req, res) => {
  try {
    const organization = req.body.userId;
    // find donors
    const donorId = await inventoryModel.distinct("donar", {
      organization,
    });
    // console.log(donarId);
    const donors = await userModel.find({ _id: { $in: donorId } });
    return res.status(200).send({
      success: true,
      message: "Donor Record Fetched Successfully",
      donors,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in Donar Records",
      error,
    });
  }
};

const getHospitalController = async (req, res) => {
  try {
    const organization = req.body.userId;

    //GET HOSPITAL ID
    const hospitalId = await inventoryModel.distinct("hospital", {
      organization,
    });
    //FIND HOSPITAL
    const hospitals = await userModel.find({
      _id: { $in: hospitalId },
    });
    return res.status(200).send({
      success: true,
      message: "Hospital Record Fetched Successfully",
      hospitals,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in Hospital Records",
      error,
    });
  }
};

// GET ORGANIZATION RECORD
const getOrganizationController = async (req, res) => {
  try {
    const donar = req.body.userId;
    const orgId = await inventoryModel.distinct("organization", {
      donar,
    });
    // find organization
    const organizations = await userModel.find({ _id: { $in: orgId } });
    return res.status(200).send({
      success: true,
      message: "ORG Data Fetched successfully",
      organizations,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in Organization Record",
      error,
    });
  }
};

// GET ORGANIZATION RECORD FOR HOSPITAL
const getOrganizationForHospitalController = async (req, res) => {
  try {
    const hospital = req.body.userId;
    const orgId = await inventoryModel.distinct("organization", {
      hospital,
    });
    // find organization
    const organizations = await userModel.find({ _id: { $in: orgId } });
    return res.status(200).send({
      success: true,
      message: "ORG Data for Hospital Fetched successfully",
      organizations,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in Fetching ORG Record for Hospital",
      error,
    });
  }
};
module.exports = {
  cerateInventoryController,
  getInventoryController,
  getDonorsController,
  getHospitalController,
  getOrganizationController,
  getOrganizationForHospitalController,
  getInventoryHospitalController,
  getRecentInventoryController,
};
