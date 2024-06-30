const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

const {
  getDonorsListController,
  getHospitalListController,
  getOrganizationListController,
  deleteDonarController,
} = require("../controllers/adminController");

//router object
const router = express.Router();

// ROUTES

//GET || DONAR LIST FOR ADMIN PANEL
router.get(
  "/donar-list",
  authMiddleware,
  adminMiddleware,
  getDonorsListController
);

//GET || HOSPITAL LIST FOR ADMIN PANEL
router.get(
  "/hospital-list",
  authMiddleware,
  adminMiddleware,
  getHospitalListController
);

//GET || ORGANIZATION LIST FOR ADMIN PANEL
router.get(
  "/organization-list",
  authMiddleware,
  adminMiddleware,
  getOrganizationListController
);

// ===============================

//DELETE DONAR || GET
router.delete(
  "/delete-donar/:id",
  authMiddleware,
  adminMiddleware,
  deleteDonarController
);

// EXPORT

module.exports = router;
