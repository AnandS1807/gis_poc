const express = require("express");
const {
  getLocations,
  createLocation,
  deleteLocation,
  getNearbyLocations,
  getLocationsInBbox,
} = require("../controllers/locationController");

const router = express.Router();

router.get("/", getLocations);
router.get("/nearby", getNearbyLocations);
router.get("/bbox", getLocationsInBbox);
router.post("/", createLocation);
router.delete("/:id", deleteLocation);

module.exports = router;
