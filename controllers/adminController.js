const userModel = require("../models/userModel");
//GET DONAR LIST FOR ADMIN PANEL
const getDonorsListController = async (req, res) => {
  try {
    const donarData = await userModel
      .find({ role: "donar" })
      .sort({ createdAt: -1 });
    return res.status(200).send({
      success: true,
      TotalCount: donarData.length,
      message: "Donar List Fetched Successfully",
      donarData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error In Donar List API",
      error,
    });
  }
};
//GET HOSPITAL LIST FOR ADMIN PANEL
const getHospitalListController = async (req, res) => {
  try {
    const hospitalData = await userModel
      .find({ role: "hospital" })
      .sort({ createdAt: -1 });
    return res.status(200).send({
      success: true,
      TotalCount: hospitalData.length,
      message: "Hospital List Fetched Successfully",
      hospitalData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error In Hospital API",
    });
  }
};

//GET HOSPITAL LIST FOR ADMIN PANEL
const getOrganizationListController = async (req, res) => {
  try {
    const orgData = await userModel
      .find({ role: "organization" })
      .sort({ createdAt: -1 });
    return res.status(200).send({
      success: true,
      TotalCount: orgData.length,
      message: "ORG List Fetched Successfully",
      orgData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error In ORG API",
    });
  }
};

// ==============================

// DELETE DONAR

const deleteDonarController = async (req, res) => {
  try {
    await userModel.findByIdAndDelete(req.params.id);
    return res.status(200).send({
      success: true,
      message: "Record Deleted Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error while deleting Record ",
      error,
    });
  }
};

//EXPORT
module.exports = {
  getDonorsListController,
  getHospitalListController,
  getOrganizationListController,
  deleteDonarController,
};
