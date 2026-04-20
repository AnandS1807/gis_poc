import React from "react";

const categories = ["all", "park", "restaurant", "hospital", "landmark", "store", "other"];

function SearchFilter({
  searchTerm,
  selectedCategory,
  onSearchChange,
  onCategoryChange,
  onSearchSubmit,
}) {
  function handleSubmit(event) {
    event.preventDefault();
    onSearchSubmit(searchTerm);
  }

  return (
    <div className="panel card">
      <h2>Search & Filter</h2>
      <form className="filter-grid" onSubmit={handleSubmit}>
        <label>
          Search by name
          <input
            value={searchTerm}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Type a place name and press Enter"
          />
        </label>

        <button type="submit" className="search-btn">
          Search on Map
        </button>

        <label>
          Filter by category
          <select
            value={selectedCategory}
            onChange={(event) => onCategoryChange(event.target.value)}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>
      </form>
    </div>
  );
}

export default SearchFilter;
