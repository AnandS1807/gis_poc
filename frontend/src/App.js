import React, { useEffect, useMemo, useState } from "react";
import MapComponent from "./components/MapComponent";
import AddLocationForm from "./components/AddLocationForm";
import SearchFilter from "./components/SearchFilter";
import { addLocation, fetchLocations } from "./services/api";

function App() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchMessage, setSearchMessage] = useState("");
  const [highlightedRegion, setHighlightedRegion] = useState(null);

  async function loadLocations(category = selectedCategory) {
    setLoading(true);
    setError("");

    try {
      const data = await fetchLocations(category);
      setLocations(data);
    } catch (err) {
      setError("Could not load locations. Please ensure backend is running.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLocations("all");
  }, []);

  useEffect(() => {
    loadLocations(selectedCategory);
  }, [selectedCategory]);

  async function handleAddLocation(payload) {
    setSubmitting(true);
    setError("");

    try {
      await addLocation(payload);
      await loadLocations(selectedCategory);
    } catch (err) {
      setError("Failed to add location. Please try again.");
      throw err;
    } finally {
      setSubmitting(false);
    }
  }

  const filteredLocations = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (!normalizedSearch) return locations;

    return locations.filter((location) =>
      location.name.toLowerCase().includes(normalizedSearch)
    );
  }, [locations, searchTerm]);

  async function handleSearchSubmit(rawTerm) {
    const normalizedSearch = rawTerm.trim().toLowerCase();

    setSearchMessage("");

    if (!normalizedSearch) {
      setHighlightedRegion(null);
      return;
    }

    const localMatch = locations.find((location) =>
      location.name.toLowerCase().includes(normalizedSearch)
    );

    if (localMatch) {
      setHighlightedRegion({
        label: localMatch.name,
        center: [localMatch.latitude, localMatch.longitude],
        type: "local",
      });
      setSearchMessage(`Focused on "${localMatch.name}" from your saved locations.`);
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(
          rawTerm
        )}`
      );

      if (!response.ok) {
        throw new Error("Search request failed");
      }

      const results = await response.json();
      const bestResult = results[0];

      if (!bestResult) {
        setHighlightedRegion(null);
        setSearchMessage("No matching location found. Try a different search keyword.");
        return;
      }

      const bounds = [
        [Number(bestResult.boundingbox[0]), Number(bestResult.boundingbox[2])],
        [Number(bestResult.boundingbox[1]), Number(bestResult.boundingbox[3])],
      ];

      setHighlightedRegion({
        label: bestResult.display_name,
        center: [Number(bestResult.lat), Number(bestResult.lon)],
        bounds,
        type: "external",
      });
      setSearchMessage(`Showing map boundary for "${bestResult.display_name}".`);
    } catch (geoError) {
      setHighlightedRegion(null);
      setSearchMessage("Could not search that place right now. Please try again.");
    }
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <h1>GIS Location Explorer</h1>
        <p>View, add, and filter landmarks on an interactive Leaflet map.</p>
      </header>

      <section className="controls">
        <SearchFilter
          searchTerm={searchTerm}
          selectedCategory={selectedCategory}
          onSearchChange={setSearchTerm}
          onCategoryChange={setSelectedCategory}
          onSearchSubmit={handleSearchSubmit}
        />
        <AddLocationForm onAdd={handleAddLocation} submitting={submitting} />
      </section>

      {searchMessage && <div className="search-banner">{searchMessage}</div>}

      {error && <div className="error-banner">{error}</div>}

      {loading ? (
        <div className="loader-wrap">
          <div className="loader" aria-label="Loading locations" />
          <p>Loading locations...</p>
        </div>
      ) : (
        <section className="map-wrapper card">
          <MapComponent
            locations={filteredLocations}
            highlightedRegion={highlightedRegion}
          />
          <p className="results-count">Showing {filteredLocations.length} location(s)</p>
        </section>
      )}
    </main>
  );
}

export default App;
