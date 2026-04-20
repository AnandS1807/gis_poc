import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});

export async function fetchLocations(category = "") {
  const params = {};

  if (category && category !== "all") {
    params.category = category;
  }

  const response = await api.get("/locations", { params });
  return response.data;
}

export async function addLocation(payload) {
  const response = await api.post("/locations", payload);
  return response.data;
}

export async function deleteLocation(id) {
  const response = await api.delete(`/locations/${id}`);
  return response.data;
}
