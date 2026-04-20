import React, { useState } from "react";

const categories = ["park", "restaurant", "hospital", "landmark", "store", "other"];

const initialFormState = {
  name: "",
  latitude: "",
  longitude: "",
  description: "",
  category: "park",
};

function AddLocationForm({ onAdd, submitting }) {
  const [formData, setFormData] = useState(initialFormState);
  const [formError, setFormError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError("");

    const payload = {
      name: formData.name.trim(),
      latitude: Number(formData.latitude),
      longitude: Number(formData.longitude),
      description: formData.description.trim(),
      category: formData.category,
    };

    if (!payload.name || !payload.description || !payload.category) {
      setFormError("Please fill in all required fields.");
      return;
    }

    if (Number.isNaN(payload.latitude) || Number.isNaN(payload.longitude)) {
      setFormError("Latitude and longitude must be valid numbers.");
      return;
    }

    if (payload.latitude < -90 || payload.latitude > 90) {
      setFormError("Latitude must be between -90 and 90.");
      return;
    }

    if (payload.longitude < -180 || payload.longitude > 180) {
      setFormError("Longitude must be between -180 and 180.");
      return;
    }

    try {
      await onAdd(payload);
      setFormData(initialFormState);
    } catch (error) {
      setFormError(
        error?.response?.data?.message ||
          "Unable to add location right now. Please try again."
      );
    }
  }

  return (
    <div className="panel card">
      <h2>Add New Location</h2>
      <form onSubmit={handleSubmit} className="form-grid">
        <label>
          Name
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Location name"
            required
          />
        </label>

        <label>
          Latitude
          <input
            name="latitude"
            type="number"
            step="any"
            value={formData.latitude}
            onChange={handleChange}
            placeholder="18.52043"
            required
          />
        </label>

        <label>
          Longitude
          <input
            name="longitude"
            type="number"
            step="any"
            value={formData.longitude}
            onChange={handleChange}
            placeholder="73.856743"
            required
          />
        </label>

        <label>
          Category
          <select name="category" value={formData.category} onChange={handleChange}>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <label className="full-width">
          Description
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            placeholder="Short description"
            required
          />
        </label>

        {formError && <p className="error-text">{formError}</p>}

        <button type="submit" disabled={submitting}>
          {submitting ? "Adding..." : "Add Location"}
        </button>
      </form>
    </div>
  );
}

export default AddLocationForm;
