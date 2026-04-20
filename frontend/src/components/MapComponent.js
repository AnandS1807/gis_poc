import React from "react";
import { Circle, MapContainer, Marker, Popup, Rectangle, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";

const defaultCenter = [18.52043, 73.856743];

const markerIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function FocusMap({ highlightedRegion }) {
  const map = useMap();

  React.useEffect(() => {
    if (!highlightedRegion) return;

    if (highlightedRegion.bounds) {
      map.fitBounds(highlightedRegion.bounds, { padding: [36, 36] });
      return;
    }

    map.setView(highlightedRegion.center, 14, { animate: true });
  }, [highlightedRegion, map]);

  return null;
}

function MapComponent({ locations, highlightedRegion }) {
  return (
    <MapContainer center={defaultCenter} zoom={12} className="map-canvas">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <FocusMap highlightedRegion={highlightedRegion} />

      {highlightedRegion?.bounds && (
        <Rectangle
          bounds={highlightedRegion.bounds}
          pathOptions={{ color: "#2563eb", weight: 2, fillOpacity: 0.12 }}
        />
      )}

      {highlightedRegion?.center && (
        <Circle
          center={highlightedRegion.center}
          radius={highlightedRegion.bounds ? 120 : 650}
          pathOptions={{ color: "#2563eb", weight: 2, fillOpacity: 0.09 }}
        >
          <Popup>
            <div className="popup-content">
              <h3>{highlightedRegion.label}</h3>
              <p>Highlighted search region</p>
            </div>
          </Popup>
        </Circle>
      )}

      {locations.map((location) => (
        <Marker
          key={location.id}
          position={[location.latitude, location.longitude]}
          icon={markerIcon}
        >
          <Popup>
            <div className="popup-content">
              <h3>{location.name}</h3>
              <p>{location.description}</p>
              <p>
                <strong>Category:</strong> {location.category}
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default MapComponent;
