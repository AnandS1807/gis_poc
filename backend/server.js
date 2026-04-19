const express = require("express");
const cors = require("cors");
const locationRoutes = require("./routes/locations");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "GIS backend is running" });
});

app.use("/api/locations", locationRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Something went wrong on the server." });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
