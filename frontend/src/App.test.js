import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import App from "./App";
import { fetchLocations, addLocation } from "./services/api";

jest.mock("./services/api", () => ({
  fetchLocations: jest.fn(),
  addLocation: jest.fn(),
}));

jest.mock("./components/MapComponent", () => {
  return function MockMapComponent({ locations }) {
    return <div>Map mock with {locations.length} locations</div>;
  };
});

describe("App", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    fetchLocations.mockResolvedValue([
      {
        id: "1",
        name: "Saras Baug",
        description: "Park",
        category: "park",
        latitude: 18.5,
        longitude: 73.8,
      },
    ]);
    addLocation.mockResolvedValue({ id: "2" });
  });

  test("loads and shows locations count", async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("Showing 1 location(s)")).toBeTruthy();
    });
  });

  test("fetches locations for selected category", async () => {
    render(<App />);

    await waitFor(() => {
      expect(fetchLocations).toHaveBeenCalled();
    });

    fireEvent.change(screen.getByLabelText("Filter by category"), {
      target: { value: "restaurant" },
    });

    await waitFor(() => {
      expect(fetchLocations).toHaveBeenCalledWith("restaurant");
    });
  });
});
