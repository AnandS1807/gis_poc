const fs = require("fs/promises");
const path = require("path");

const DATA_FILE = path.join(__dirname, "..", "data", "locations.json");

async function readLocations() {
  const raw = await fs.readFile(DATA_FILE, "utf-8");
  return JSON.parse(raw);
}

async function writeLocations(locations) {
  await fs.writeFile(DATA_FILE, JSON.stringify(locations, null, 2), "utf-8");
}

function normalizeCategory(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

function validateLocationInput(body) {
  const errors = [];
  const name = String(body.name || "").trim();
  const description = String(body.description || "").trim();
  const category = normalizeCategory(body.category);
  const latitude = Number(body.latitude);
  const longitude = Number(body.longitude);

  if (!name) errors.push("name is required");
  if (!description) errors.push("description is required");
  if (!category) errors.push("category is required");
  if (Number.isNaN(latitude) || latitude < -90 || latitude > 90) {
    errors.push("latitude must be a valid number between -90 and 90");
  }
  if (Number.isNaN(longitude) || longitude < -180 || longitude > 180) {
    errors.push("longitude must be a valid number between -180 and 180");
  }

  return {
    errors,
    value: {
      name,
      description,
      category,
      latitude,
      longitude,
    },
  };
}

async function getLocations(req, res, next) {
  try {
    const locations = await readLocations();
    const { category } = req.query;

    if (category) {
      const normalized = normalizeCategory(category);
      const filtered = locations.filter(
        (location) => normalizeCategory(location.category) === normalized
      );
      return res.json(filtered);
    }

    return res.json(locations);
  } catch (error) {
    return next(error);
  }
}

async function createLocation(req, res, next) {
  try {
    const locations = await readLocations();
    const { errors, value } = validateLocationInput(req.body);

    if (errors.length) {
      return res.status(400).json({ message: "Validation failed", errors });
    }

    const newLocation = {
      id: Date.now().toString(),
      ...value,
      createdAt: new Date().toISOString(),
    };

    locations.push(newLocation);
    await writeLocations(locations);

    return res.status(201).json(newLocation);
  } catch (error) {
    return next(error);
  }
}

async function deleteLocation(req, res, next) {
  try {
    const { id } = req.params;
    const locations = await readLocations();
    const index = locations.findIndex((location) => location.id === id);

    if (index === -1) {
      return res.status(404).json({ message: "Location not found" });
    }

    const [removed] = locations.splice(index, 1);
    await writeLocations(locations);

    return res.json({ message: "Location deleted", location: removed });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getLocations,
  createLocation,
  deleteLocation,
};
