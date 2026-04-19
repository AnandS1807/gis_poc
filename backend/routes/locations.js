const express = require("express");
const {
  getLocations,
  createLocation,
  deleteLocation,
} = require("../controllers/locationController");

const router = express.Router();

router.get("/", getLocations);
router.post("/", createLocation);
router.delete("/:id", deleteLocation);

module.exports = router;
