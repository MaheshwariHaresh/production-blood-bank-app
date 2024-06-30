const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  cerateInventoryController,
  getInventoryController,
  getDonorsController,
  getHospitalController,
  getOrganizationController,
  getOrganizationForHospitalController,
  getInventoryHospitalController,
  getRecentInventoryController,
} = require("../controllers/inventoryController");

const router = express.Router();

// ADD INVENTORY // POST
router.post("/create-inventory", authMiddleware, cerateInventoryController);

// GET ALL BLOOD RECORDS
router.get("/get-inventory", authMiddleware, getInventoryController);

// GET RECENT INVENTORY OF 3
router.get(
  "/get-recent-inventory",
  authMiddleware,
  getRecentInventoryController
);

// GET HOSPITAL BLOOD RECORDS
router.post(
  "/get-inventory-hospital",
  authMiddleware,
  getInventoryHospitalController
);

// GET DONAR RECORDS
router.get("/get-donors", authMiddleware, getDonorsController);

// GET HOSPITAL RECORDS
router.get("/get-hospitals", authMiddleware, getHospitalController);

// GET ORGANIZATION RECORDS
router.get("/get-organizations", authMiddleware, getOrganizationController);

// GET ORGANIZATION RECORDS FOR HOSPITAL
router.get(
  "/get-organizations-for-hospital",
  authMiddleware,
  getOrganizationForHospitalController
);
module.exports = router;
