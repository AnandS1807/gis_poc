const request = require("supertest");

jest.mock("fs/promises", () => ({
  readFile: jest.fn(),
  writeFile: jest.fn(),
}));

const fs = require("fs/promises");
const app = require("../server");

describe("Locations API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("GET / returns backend health message", async () => {
    const response = await request(app).get("/");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "GIS backend is running" });
  });

  test("GET /api/locations returns all locations", async () => {
    const locations = [
      {
        id: "1",
        name: "Saras Baug",
        description: "Park",
        category: "park",
        latitude: 18.5,
        longitude: 73.8,
      },
    ];

    fs.readFile.mockResolvedValue(JSON.stringify(locations));

    const response = await request(app).get("/api/locations");

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].name).toBe("Saras Baug");
  });

  test("GET /api/locations?category=park filters by category", async () => {
    const locations = [
      {
        id: "1",
        name: "Saras Baug",
        description: "Park",
        category: "park",
        latitude: 18.5,
        longitude: 73.8,
      },
      {
        id: "2",
        name: "Cafe",
        description: "Restaurant",
        category: "restaurant",
        latitude: 18.6,
        longitude: 73.9,
      },
    ];

    fs.readFile.mockResolvedValue(JSON.stringify(locations));

    const response = await request(app).get("/api/locations?category=park");

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].category).toBe("park");
  });

  test("POST /api/locations validates input", async () => {
    fs.readFile.mockResolvedValue("[]");

    const response = await request(app).post("/api/locations").send({});

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Validation failed");
    expect(response.body.errors.length).toBeGreaterThan(0);
  });

  test("DELETE /api/locations/:id returns 404 for missing id", async () => {
    fs.readFile.mockResolvedValue(JSON.stringify([]));

    const response = await request(app).delete("/api/locations/does-not-exist");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "Location not found" });
  });
});
