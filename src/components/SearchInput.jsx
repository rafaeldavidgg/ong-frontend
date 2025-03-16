import { useState } from "react";
import PropTypes from "prop-types";
import "./css/SearchInput.css";

const SearchInput = ({ searchTerm, setSearchTerm }) => {
  const [inputValue, setInputValue] = useState(searchTerm);

  const handleChange = (e) => {
    setInputValue(e.target.value);
    setSearchTerm(e.target.value);
  };

  return (
    <div className="search-input-container">
      <input
        type="text"
        placeholder="Buscar"
        value={inputValue}
        onChange={handleChange}
        className="search-input"
      />
    </div>
  );
};

SearchInput.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  setSearchTerm: PropTypes.func.isRequired,
};

export default SearchInput;
